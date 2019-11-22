// Copyright 2016-present 650 Industries. All rights reserved.

#import "ABI36_0_0EXNotifications.h"
#import "ABI36_0_0EXModuleRegistryBinding.h"
#import "ABI36_0_0EXUnversioned.h"
#import "ABI36_0_0EXUtil.h"

#import <ABI36_0_0React/ABI36_0_0RCTUtils.h>
#import <ABI36_0_0React/ABI36_0_0RCTConvert.h>

#import "ABI36_0_0EXConstantsBinding.h"

@implementation ABI36_0_0RCTConvert (NSCalendarUnit)

ABI36_0_0RCT_ENUM_CONVERTER(NSCalendarUnit,
                   (@{
                      @"year": @(NSCalendarUnitYear),
                      @"month": @(NSCalendarUnitMonth),
                      @"week": @(NSCalendarUnitWeekOfYear),
                      @"day": @(NSCalendarUnitDay),
                      @"hour": @(NSCalendarUnitHour),
                      @"minute": @(NSCalendarUnitMinute)
                      }),
                   0,
                   integerValue);

@end

@interface ABI36_0_0EXNotifications ()

// unversioned ABI36_0_0EXRemoteNotificationManager instance
@property (nonatomic, weak) id <ABI36_0_0EXNotificationsScopedModuleDelegate> remoteNotificationsDelegate;
@property (nonatomic, weak) id <ABI36_0_0EXNotificationsIdentifiersManager> notificationsIdentifiersManager;
@property (nonatomic, weak) id <ABI36_0_0EXUserNotificationCenterService> userNotificationCenter;

@end

@implementation ABI36_0_0EXNotifications

ABI36_0_0EX_EXPORT_SCOPED_MULTISERVICE_MODULE(ExponentNotifications, @"RemoteNotificationManager", @"UserNotificationManager", @"UserNotificationCenter");

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;

- (void)setBridge:(ABI36_0_0RCTBridge *)bridge
{
  _bridge = bridge;
}

- (instancetype)initWithExperienceId:(NSString *)experienceId kernelServiceDelegates:(NSDictionary *)kernelServiceInstances params:(NSDictionary *)params
{
  if (self = [super initWithExperienceId:experienceId kernelServiceDelegates:kernelServiceInstances params:params]) {
    _userNotificationCenter = kernelServiceInstances[@"UserNotificationCenter"];
    _remoteNotificationsDelegate = kernelServiceInstances[@"RemoteNotificationManager"];
    _notificationsIdentifiersManager = kernelServiceInstances[@"UserNotificationManager"];
  }
  return self;
}

ABI36_0_0RCT_REMAP_METHOD(getDevicePushTokenAsync,
                 getDevicePushTokenWithConfig: (__unused NSDictionary *)config
                 resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  ABI36_0_0EXConstantsBinding *constants = [_bridge.scopedModules.moduleRegistry getModuleImplementingProtocol:@protocol(ABI36_0_0UMConstantsInterface)];

  if (![constants.appOwnership isEqualToString:@"standalone"]) {
    return reject(0, @"getDevicePushTokenAsync is only accessible within standalone applications", nil);
  }

  NSString *token = [_remoteNotificationsDelegate apnsTokenStringForScopedModule:self];
  if (!token) {
    return reject(0, @"APNS token has not been set", nil);
  }
  return resolve(@{ @"type": @"apns", @"data": token });
}

ABI36_0_0RCT_REMAP_METHOD(getExponentPushTokenAsync,
                 getExponentPushTokenAsyncWithResolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  if (!self.experienceId) {
    reject(@"E_NOTIFICATIONS_INTERNAL_ERROR", @"The notifications module is missing the current project's ID", nil);
    return;
  }

  [_remoteNotificationsDelegate getExpoPushTokenForScopedModule:self completionHandler:^(NSString *pushToken, NSError *error) {
    if (error) {
      reject(@"E_NOTIFICATIONS_TOKEN_REGISTRATION_FAILED", error.localizedDescription, error);
    } else {
      resolve(pushToken);
    }
  }];
}

ABI36_0_0RCT_EXPORT_METHOD(presentLocalNotification:(NSDictionary *)payload
                  resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(__unused ABI36_0_0RCTPromiseRejectBlock)reject)
{
  if (!payload[@"data"]) {
    reject(@"E_NOTIF_NO_DATA", @"Attempted to send a local notification with no `data` property.", nil);
    return;
  }
  UNMutableNotificationContent *content = [self _localNotificationFromPayload:payload];
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:content.userInfo[@"id"]
                                                                        content:content
                                                                        trigger:nil];

  [_userNotificationCenter addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject(@"E_NOTIF", [NSString stringWithFormat:@"Could not add a notification request: %@", error.localizedDescription], error);
    } else {
      resolve(content.userInfo[@"id"]);
    }
  }];
}


  ABI36_0_0RCT_EXPORT_METHOD(scheduleNotificationWithTimer:(NSDictionary *)payload
                   withOptions:(NSDictionary *)options
                   resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                   rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
 if (!payload[@"data"]) {
   reject(@"E_NOTIF_NO_DATA", @"Attempted to send a local notification with no `data` property.", nil);
   return;
 }
 BOOL repeats = [options[@"repeat"] boolValue];
 int seconds = [options[@"interval"] intValue] / 1000;
 UNTimeIntervalNotificationTrigger *notificationTrigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:seconds repeats:repeats];
 UNMutableNotificationContent *content = [self _localNotificationFromPayload:payload];
 UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:content.userInfo[@"id"]
                                                                       content:content
                                                                       trigger:notificationTrigger];
 [_userNotificationCenter addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
   if (error) {
     reject(@"E_NOTIF_REQ", error.localizedDescription, error);
   } else {
     resolve(content.userInfo[@"id"]);
   }
 }];
}

ABI36_0_0RCT_EXPORT_METHOD(scheduleNotificationWithCalendar:(NSDictionary *)payload
                 withOptions:(NSDictionary *)options
                 resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
 if (!payload[@"data"]) {
   reject(@"E_NOTIF_NO_DATA", @"Attempted to send a local notification with no `data` property.", nil);
   return;
 }
 UNCalendarNotificationTrigger *notificationTrigger = [self calendarTriggerFrom:options];
 UNMutableNotificationContent *content = [self _localNotificationFromPayload:payload];
 UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:content.userInfo[@"id"]
                                                                       content:content
                                                                       trigger:notificationTrigger];
 [_userNotificationCenter addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
   if (error) {
     reject(@"E_NOTIF_REQ", error.localizedDescription, error);
   } else {
     resolve(content.userInfo[@"id"]);
   }
 }];
}


ABI36_0_0RCT_EXPORT_METHOD(scheduleLocalNotification:(NSDictionary *)payload
                  withOptions:(NSDictionary *)options
                  resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  if (!payload[@"data"]) {
    reject(@"E_NOTIF_NO_DATA", @"Attempted to send a local notification with no `data` property.", nil);
    return;
  }
  UNCalendarNotificationTrigger *notificationTrigger = [self notificationTriggerFor:options[@"time"]];
  UNMutableNotificationContent *content = [self _localNotificationFromPayload:payload];
  UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:content.userInfo[@"id"]
                                                                        content:content
                                                                        trigger:notificationTrigger];
  [_userNotificationCenter addNotificationRequest:request withCompletionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject(@"E_NOTIF_REQ", error.localizedDescription, error);
    } else {
      resolve(content.userInfo[@"id"]);
    }
  }];
}

ABI36_0_0RCT_EXPORT_METHOD(legacyScheduleLocalRepeatingNotification:(NSDictionary *)payload
                  withOptions:(NSDictionary *)options
                  resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  #pragma GCC diagnostic ignored "-Wdeprecated-declarations"
  if (!payload[@"data"]) {
    reject(@"E_NOTIF_NO_DATA", @"Attempted to send a local notification with no `data` property.", nil);
    return;
  }
  UILocalNotification *localNotification = [UILocalNotification new];
  NSString *uniqueId = [[NSUUID new] UUIDString];
  localNotification.alertTitle = payload[@"title"];
  localNotification.alertBody = payload[@"body"];
  if ([payload[@"sound"] boolValue]) {
    localNotification.soundName = UILocalNotificationDefaultSoundName;
  }
  if ([payload[@"categoryId"] isKindOfClass:[NSString class]]) {
    localNotification.category = [self internalIdForIdentifier:payload[@"categoryId"]];
  }
  localNotification.applicationIconBadgeNumber = [ABI36_0_0RCTConvert NSInteger:payload[@"count"]] ?: 0;
  localNotification.userInfo = @{
                                 @"body": payload[@"data"],
                                 @"experienceId": self.experienceId,
                                 @"id": uniqueId
                                 };
  localNotification.fireDate = [ABI36_0_0RCTConvert NSDate:options[@"time"]] ?: [NSDate new];
  localNotification.repeatInterval = [ABI36_0_0RCTConvert NSCalendarUnit:options[@"repeat"]] ?: 0;

  __weak typeof(self) weakSelf = self;
  [ABI36_0_0EXUtil performSynchronouslyOnMainThread:^{
    [ABI36_0_0RCTSharedApplication() scheduleLocalNotification:localNotification];
    dispatch_queue_t methodQueue = weakSelf.methodQueue;
    if (methodQueue) {
      dispatch_async(methodQueue, ^{
        resolve(uniqueId);
      });
    }
  }];
  #pragma GCC diagnostic warning "-Wdeprecated-declarations"
}

ABI36_0_0RCT_REMAP_METHOD(cancelScheduledNotificationAsync,
                 cancelScheduledNotificationAsync:(NSString *)uniqueId
                 withResolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  __weak id<ABI36_0_0EXUserNotificationCenterService> userNotificationCenter = _userNotificationCenter;
  [_userNotificationCenter getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> * _Nonnull requests) {
    for (UNNotificationRequest *request in requests) {
      if ([request.content.userInfo[@"id"] isEqualToString:uniqueId]) {
        [userNotificationCenter removePendingNotificationRequestsWithIdentifiers:@[request.identifier]];
        return resolve(nil);
      }
    }
    reject(@"E_NO_NOTIF", [NSString stringWithFormat:@"Could not find pending notification request to cancel with id = %@", uniqueId], nil);
  }];
}

ABI36_0_0RCT_REMAP_METHOD(cancelAllScheduledNotificationsAsync,
                 cancelAllScheduledNotificationsAsyncWithResolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(__unused ABI36_0_0RCTPromiseRejectBlock)reject)
{
  __weak id<ABI36_0_0EXUserNotificationCenterService> userNotificationCenter = _userNotificationCenter;
  [_userNotificationCenter getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> * _Nonnull requests) {
    NSMutableArray<NSString *> *requestsToCancelIdentifiers = [NSMutableArray new];
    for (UNNotificationRequest *request in requests) {
      if ([request.content.userInfo[@"experienceId"] isEqualToString:self.experienceId]) {
        [requestsToCancelIdentifiers addObject:request.identifier];
      }
    }
    [userNotificationCenter removePendingNotificationRequestsWithIdentifiers:requestsToCancelIdentifiers];
    resolve(nil);
  }];
}

#pragma mark - Badges

// TODO: Make this read from the kernel instead of UIApplication for the main Exponent app

ABI36_0_0RCT_REMAP_METHOD(getBadgeNumberAsync,
                 getBadgeNumberAsyncWithResolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(ABI36_0_0RCTPromiseRejectBlock)reject)
{
  __block NSInteger badgeNumber;
  [ABI36_0_0EXUtil performSynchronouslyOnMainThread:^{
    badgeNumber = ABI36_0_0RCTSharedApplication().applicationIconBadgeNumber;
  }];
  resolve(@(badgeNumber));
}

ABI36_0_0RCT_EXPORT_METHOD(setBadgeNumberAsync:(nonnull NSNumber *)number
                  resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(__unused ABI36_0_0RCTPromiseRejectBlock)reject)
{
  [ABI36_0_0EXUtil performSynchronouslyOnMainThread:^{
    ABI36_0_0RCTSharedApplication().applicationIconBadgeNumber = number.integerValue;
  }];
  resolve(nil);
}

# pragma mark - Categories

ABI36_0_0RCT_REMAP_METHOD(createCategoryAsync,
                 createCategoryWithCategoryId:(NSString *)categoryId
                 actions:(NSArray *)actions
                 resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(__unused ABI36_0_0RCTPromiseRejectBlock)reject)
{
  NSMutableArray<UNNotificationAction *> *actionsArray = [[NSMutableArray alloc] init];
  for (NSDictionary<NSString *, id> *actionParams in actions) {
    [actionsArray addObject:[self parseNotificationActionFromParams:actionParams]];
  }

  UNNotificationCategory *newCategory = [UNNotificationCategory categoryWithIdentifier:[self internalIdForIdentifier:categoryId]
                                                                               actions:actionsArray
                                                                     intentIdentifiers:@[]
                                                                               options:UNNotificationCategoryOptionNone];

  __weak id<ABI36_0_0EXUserNotificationCenterService> userNotificationCenter = _userNotificationCenter;
  [_userNotificationCenter getNotificationCategoriesWithCompletionHandler:^(NSSet<UNNotificationCategory *> *categories) {
    NSMutableSet<UNNotificationCategory *> *newCategories = [categories mutableCopy];
    for (UNNotificationCategory *category in newCategories) {
      if ([category.identifier isEqualToString:newCategory.identifier]) {
        [newCategories removeObject:category];
        break;
      }
    }
    [newCategories addObject:newCategory];
    [userNotificationCenter setNotificationCategories:newCategories];
    resolve(nil);
  }];
}

ABI36_0_0RCT_REMAP_METHOD(deleteCategoryAsync,
                 deleteCategoryWithCategoryId:(NSString *)categoryId
                 resolver:(ABI36_0_0RCTPromiseResolveBlock)resolve
                 rejecter:(__unused ABI36_0_0RCTPromiseRejectBlock)reject)
{
  NSString *internalCategoryId = [self internalIdForIdentifier:categoryId];
  __weak id<ABI36_0_0EXUserNotificationCenterService> userNotificationCenter = _userNotificationCenter;
  [_userNotificationCenter getNotificationCategoriesWithCompletionHandler:^(NSSet<UNNotificationCategory *> *categories) {
    NSMutableSet<UNNotificationCategory *> *newCategories = [categories mutableCopy];
    for (UNNotificationCategory *category in newCategories) {
      if ([category.identifier isEqualToString:internalCategoryId]) {
        [newCategories removeObject:category];
        break;
      }
    }
    [userNotificationCenter setNotificationCategories:newCategories];
    resolve(nil);
  }];
}

#pragma mark - internal

- (UNMutableNotificationContent *)_localNotificationFromPayload:(NSDictionary *)payload
{
  UNMutableNotificationContent *content = [UNMutableNotificationContent new];

  NSString *uniqueId = [[NSUUID new] UUIDString];

  content.title = payload[@"title"];
  content.body = payload[@"body"];

  if ([payload[@"sound"] boolValue]) {
    content.sound = [UNNotificationSound defaultSound];
  }

  if ([payload[@"count"] isKindOfClass:[NSNumber class]]) {
    content.badge = (NSNumber *)payload[@"count"];
  }

  if ([payload[@"categoryId"] isKindOfClass:[NSString class]]) {
    content.categoryIdentifier = [self internalIdForIdentifier:payload[@"categoryId"]];
  }

  content.userInfo = @{
                       @"body": payload[@"data"],
                       @"experienceId": self.experienceId,
                       @"id": uniqueId
                       };

  return content;
}

- (NSString *)internalIdForIdentifier:(NSString *)identifier {
  return [_notificationsIdentifiersManager internalIdForIdentifier:identifier experienceId:self.experienceId];
}

- (UNCalendarNotificationTrigger *)notificationTriggerFor:(NSNumber * _Nullable)unixTime
{
  NSDateComponents *dateComponents = [self dateComponentsFrom:unixTime];
  return [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:dateComponents repeats:NO];
}

- (NSDateComponents *)dateComponentsFrom:(NSNumber * _Nullable)unixTime {
  static unsigned unitFlags = NSCalendarUnitSecond | NSCalendarUnitMinute | NSCalendarUnitHour | NSCalendarUnitDay | NSCalendarUnitMonth |  NSCalendarUnitYear;
  NSDate *triggerDate = [ABI36_0_0RCTConvert NSDate:unixTime] ?: [NSDate new];
  NSCalendar *calendar = [[NSCalendar alloc] initWithCalendarIdentifier:NSCalendarIdentifierGregorian];
  return [calendar components:unitFlags fromDate:triggerDate];
}

- (UNCalendarNotificationTrigger *)calendarTriggerFrom:(NSDictionary *)options
{
 BOOL repeats = [options[@"repeat"] boolValue];

  NSDateComponents *date = [[NSDateComponents alloc] init];

  NSArray *timeUnits = @[@"year", @"day", @"weekDay", @"month", @"hour", @"second", @"minute"];

  for (NSString *timeUnit in timeUnits) {
   if (options[timeUnit]) {
     [date setValue:options[timeUnit] forKey:timeUnit];
   }
 }

  return [UNCalendarNotificationTrigger triggerWithDateMatchingComponents:date repeats:repeats];
}


- (UNNotificationAction *)parseNotificationActionFromParams:(NSDictionary *)params
{
  NSString *actionId = [self internalIdForIdentifier:params[@"actionId"]];
  NSString *buttonTitle = params[@"buttonTitle"];

  UNNotificationActionOptions options = UNNotificationActionOptionNone;
  if (![params[@"doNotOpenInForeground"] boolValue]) {
    options += UNNotificationActionOptionForeground;
  }
  if ([params[@"isDestructive"] boolValue]) {
    options += UNNotificationActionOptionDestructive;
  }
  if ([params[@"isAuthenticationRequired"] boolValue]) {
    options += UNNotificationActionOptionAuthenticationRequired;
  }

  if ([params[@"textInput"] isKindOfClass:[NSDictionary class]]) {
    return [UNTextInputNotificationAction actionWithIdentifier:actionId
                                                         title:buttonTitle
                                                       options:options
                                          textInputButtonTitle:params[@"textInput"][@"submitButtonTitle"]
                                          textInputPlaceholder:params[@"textInput"][@"placeholder"]];
  }

  return [UNNotificationAction actionWithIdentifier:actionId title:buttonTitle options:options];
}

@end
