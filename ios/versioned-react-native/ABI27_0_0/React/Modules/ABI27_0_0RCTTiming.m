/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI27_0_0RCTTiming.h"

#import "ABI27_0_0RCTAssert.h"
#import "ABI27_0_0RCTBridge+Private.h"
#import "ABI27_0_0RCTBridge.h"
#import "ABI27_0_0RCTLog.h"
#import "ABI27_0_0RCTUtils.h"

static const NSTimeInterval kMinimumSleepInterval = 1;

// These timing contants should be kept in sync with the ones in `JSTimers.js`.
// The duration of a frame. This assumes that we want to run at 60 fps.
static const NSTimeInterval kFrameDuration = 1.0 / 60.0;
// The minimum time left in a frame to trigger the idle callback.
static const NSTimeInterval kIdleCallbackFrameDeadline = 0.001;

@interface _ABI27_0_0RCTTimer : NSObject

@property (nonatomic, strong, readonly) NSDate *target;
@property (nonatomic, assign, readonly) BOOL repeats;
@property (nonatomic, copy, readonly) NSNumber *callbackID;
@property (nonatomic, assign, readonly) NSTimeInterval interval;

@end

@implementation _ABI27_0_0RCTTimer

- (instancetype)initWithCallbackID:(NSNumber *)callbackID
                          interval:(NSTimeInterval)interval
                        targetTime:(NSTimeInterval)targetTime
                           repeats:(BOOL)repeats
{
  if ((self = [super init])) {
    _interval = interval;
    _repeats = repeats;
    _callbackID = callbackID;
    _target = [NSDate dateWithTimeIntervalSinceNow:targetTime];
  }
  return self;
}

/**
 * Returns `YES` if we should invoke the JS callback.
 */
- (BOOL)shouldFire:(NSDate *)now
{
  if (_target && [_target timeIntervalSinceDate:now] <= 0) {
    return YES;
  }
  return NO;
}

- (void)reschedule
{
  // The JS Timers will do fine grained calculating of expired timeouts.
  _target = [NSDate dateWithTimeIntervalSinceNow:_interval];
}

@end

@interface _ABI27_0_0RCTTimingProxy : NSObject

@end

// NSTimer retains its target, insert this class to break potential retain cycles
@implementation _ABI27_0_0RCTTimingProxy
{
  __weak id _target;
}

+ (instancetype)proxyWithTarget:(id)target
{
  _ABI27_0_0RCTTimingProxy *proxy = [self new];
  if (proxy) {
    proxy->_target = target;
  }
  return proxy;
}

- (void)timerDidFire
{
  [_target timerDidFire];
}

@end

@implementation ABI27_0_0RCTTiming
{
  NSMutableDictionary<NSNumber *, _ABI27_0_0RCTTimer *> *_timers;
  NSTimer *_sleepTimer;
  BOOL _sendIdleEvents;
}

@synthesize bridge = _bridge;
@synthesize paused = _paused;
@synthesize pauseCallback = _pauseCallback;

ABI27_0_0RCT_EXPORT_MODULE()

- (void)setBridge:(ABI27_0_0RCTBridge *)bridge
{
  ABI27_0_0RCTAssert(!_bridge, @"Should never be initialized twice!");

  _paused = YES;
  _timers = [NSMutableDictionary new];

  for (NSString *name in @[UIApplicationWillResignActiveNotification,
                           UIApplicationDidEnterBackgroundNotification,
                           UIApplicationWillTerminateNotification]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(stopTimers)
                                                 name:name
                                               object:nil];
  }

  for (NSString *name in @[UIApplicationDidBecomeActiveNotification,
                           UIApplicationWillEnterForegroundNotification]) {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(startTimers)
                                                 name:name
                                               object:nil];
  }

  _bridge = bridge;
}

- (void)dealloc
{
  [_sleepTimer invalidate];
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (dispatch_queue_t)methodQueue
{
  return ABI27_0_0RCTJSThread;
}

- (void)invalidate
{
  [self stopTimers];
  _bridge = nil;
}

- (void)stopTimers
{
  if (!_paused) {
    _paused = YES;
    if (_pauseCallback) {
      _pauseCallback();
    }
  }
}

- (void)startTimers
{
  if (!_bridge || ![self hasPendingTimers]) {
    return;
  }

  if (_paused) {
    _paused = NO;
    if (_pauseCallback) {
      _pauseCallback();
    }
  }
}

- (BOOL)hasPendingTimers
{
  return _sendIdleEvents || _timers.count > 0;
}

- (void)didUpdateFrame:(ABI27_0_0RCTFrameUpdate *)update
{
  NSDate *nextScheduledTarget = [NSDate distantFuture];
  NSMutableArray<_ABI27_0_0RCTTimer *> *timersToCall = [NSMutableArray new];
  NSDate *now = [NSDate date]; // compare all the timers to the same base time
  for (_ABI27_0_0RCTTimer *timer in _timers.allValues) {
    if ([timer shouldFire:now]) {
      [timersToCall addObject:timer];
    } else {
      nextScheduledTarget = [nextScheduledTarget earlierDate:timer.target];
    }
  }

  // Call timers that need to be called
  if (timersToCall.count > 0) {
    NSArray<NSNumber *> *sortedTimers = [[timersToCall sortedArrayUsingComparator:^(_ABI27_0_0RCTTimer *a, _ABI27_0_0RCTTimer *b) {
      return [a.target compare:b.target];
    }] valueForKey:@"callbackID"];
    [_bridge enqueueJSCall:@"JSTimers"
                    method:@"callTimers"
                      args:@[sortedTimers]
                completion:NULL];
  }

  for (_ABI27_0_0RCTTimer *timer in timersToCall) {
    if (timer.repeats) {
      [timer reschedule];
      nextScheduledTarget = [nextScheduledTarget earlierDate:timer.target];
    } else {
      [_timers removeObjectForKey:timer.callbackID];
    }
  }

  if (_sendIdleEvents) {
    NSTimeInterval frameElapsed = (CACurrentMediaTime() - update.timestamp);
    if (kFrameDuration - frameElapsed >= kIdleCallbackFrameDeadline) {
      NSTimeInterval currentTimestamp = [[NSDate date] timeIntervalSince1970];
      NSNumber *absoluteFrameStartMS = @((currentTimestamp - frameElapsed) * 1000);
      [_bridge enqueueJSCall:@"JSTimers"
                      method:@"callIdleCallbacks"
                        args:@[absoluteFrameStartMS]
                  completion:NULL];
    }
  }

  // Switch to a paused state only if we didn't call any timer this frame, so if
  // in response to this timer another timer is scheduled, we don't pause and unpause
  // the displaylink frivolously.
  if (!_sendIdleEvents && timersToCall.count == 0) {
    // No need to call the pauseCallback as ABI27_0_0RCTDisplayLink will ask us about our paused
    // status immediately after completing this call
    if (_timers.count == 0) {
      _paused = YES;
    }
    // If the next timer is more than 1 second out, pause and schedule an NSTimer;
    else if ([nextScheduledTarget timeIntervalSinceNow] > kMinimumSleepInterval) {
      [self scheduleSleepTimer:nextScheduledTarget];
      _paused = YES;
    }
  }
}

- (void)scheduleSleepTimer:(NSDate *)sleepTarget
{
  if (!_sleepTimer || !_sleepTimer.valid) {
    _sleepTimer = [[NSTimer alloc] initWithFireDate:sleepTarget
                                           interval:0
                                             target:[_ABI27_0_0RCTTimingProxy proxyWithTarget:self]
                                           selector:@selector(timerDidFire)
                                           userInfo:nil
                                            repeats:NO];
    [[NSRunLoop currentRunLoop] addTimer:_sleepTimer forMode:NSDefaultRunLoopMode];
  } else {
    _sleepTimer.fireDate = [_sleepTimer.fireDate earlierDate:sleepTarget];
  }
}

- (void)timerDidFire
{
  _sleepTimer = nil;
  if (_paused) {
    [self startTimers];

    // Immediately dispatch frame, so we don't have to wait on the displaylink.
    [self didUpdateFrame:nil];
  }
}

/**
 * There's a small difference between the time when we call
 * setTimeout/setInterval/requestAnimation frame and the time it actually makes
 * it here. This is important and needs to be taken into account when
 * calculating the timer's target time. We calculate this by passing in
 * Date.now() from JS and then subtracting that from the current time here.
 */
ABI27_0_0RCT_EXPORT_METHOD(createTimer:(nonnull NSNumber *)callbackID
                  duration:(NSTimeInterval)jsDuration
                  jsSchedulingTime:(NSDate *)jsSchedulingTime
                  repeats:(BOOL)repeats)
{
  if (jsDuration == 0 && repeats == NO) {
    // For super fast, one-off timers, just enqueue them immediately rather than waiting a frame.
    [_bridge _immediatelyCallTimer:callbackID];
    return;
  }

  NSTimeInterval jsSchedulingOverhead = MAX(-jsSchedulingTime.timeIntervalSinceNow, 0);

  NSTimeInterval targetTime = jsDuration - jsSchedulingOverhead;
  if (jsDuration < 0.018) { // Make sure short intervals run each frame
    jsDuration = 0;
  }

  _ABI27_0_0RCTTimer *timer = [[_ABI27_0_0RCTTimer alloc] initWithCallbackID:callbackID
                                                  interval:jsDuration
                                                targetTime:targetTime
                                                   repeats:repeats];
  _timers[callbackID] = timer;
  if (_paused) {
    if ([timer.target timeIntervalSinceNow] > kMinimumSleepInterval) {
      [self scheduleSleepTimer:timer.target];
    } else {
      [self startTimers];
    }
  }
}

ABI27_0_0RCT_EXPORT_METHOD(deleteTimer:(nonnull NSNumber *)timerID)
{
  [_timers removeObjectForKey:timerID];
  if (![self hasPendingTimers]) {
    [self stopTimers];
  }
}

ABI27_0_0RCT_EXPORT_METHOD(setSendIdleEvents:(BOOL)sendIdleEvents)
{
  _sendIdleEvents = sendIdleEvents;
  if (sendIdleEvents) {
    [self startTimers];
  } else if (![self hasPendingTimers]) {
    [self stopTimers];
  }
}

@end
