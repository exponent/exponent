// Copyright 2018-present 650 Industries. All rights reserved.

#import "ABI38_0_0EXScopedNotificationSchedulerModule.h"
#import "ABI38_0_0EXScopedNotificationsUtils.h"

#import <ABI38_0_0EXNotifications/ABI38_0_0EXNotificationSerializer.h>

@interface ABI38_0_0EXScopedNotificationSchedulerModule ()

@property (nonatomic, strong) NSString *experienceId;

@end

// TODO: (@lukmccall) experiences may break one another by trying to schedule notifications of the same identifier.
// See https://github.com/expo/expo/pull/8361#discussion_r429153429.
@implementation ABI38_0_0EXScopedNotificationSchedulerModule

- (instancetype)initWithExperienceId:(NSString *)experienceId
{
  if (self = [super init]) {
    _experienceId = experienceId;
  }

  return self;
}

- (NSArray * _Nonnull)serializeNotificationRequests:(NSArray<UNNotificationRequest *> * _Nonnull) requests;
{
  NSMutableArray *serializedRequests = [NSMutableArray new];
  for (UNNotificationRequest *request in requests) {
    if ([ABI38_0_0EXScopedNotificationsUtils shouldNotificationRequest:request beHandledByExperience:_experienceId]) {
      [serializedRequests addObject:[ABI38_0_0EXNotificationSerializer serializedNotificationRequest:request]];
    }
  }
  return serializedRequests;
}

- (void)cancelNotification:(NSString *)identifier resolve:(ABI38_0_0UMPromiseResolveBlock)resolve rejecting:(ABI38_0_0UMPromiseRejectBlock)reject
{
  __block NSString *experienceId = _experienceId;
  [[UNUserNotificationCenter currentNotificationCenter] getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> * _Nonnull requests) {
    for (UNNotificationRequest *request in requests) {
      if ([request.identifier isEqual:identifier]) {
        if ([ABI38_0_0EXScopedNotificationsUtils shouldNotificationRequest:request beHandledByExperience:experienceId]) {
          [[UNUserNotificationCenter currentNotificationCenter] removePendingNotificationRequestsWithIdentifiers:@[identifier]];
        }
        break;
      }
    }
    resolve(nil);
  }];
}

- (void)cancelAllNotificationsWithResolver:(ABI38_0_0UMPromiseResolveBlock)resolve rejecting:(ABI38_0_0UMPromiseRejectBlock)reject
{
  __block NSString *experienceId = _experienceId;
  [[UNUserNotificationCenter currentNotificationCenter] getPendingNotificationRequestsWithCompletionHandler:^(NSArray<UNNotificationRequest *> * _Nonnull requests) {
    NSMutableArray<NSString *> *toRemove = [NSMutableArray new];
    for (UNNotificationRequest *request in requests) {
      if ([ABI38_0_0EXScopedNotificationsUtils shouldNotificationRequest:request beHandledByExperience:experienceId]) {
        [toRemove addObject:request.identifier];
      }
    }
    [[UNUserNotificationCenter currentNotificationCenter] removePendingNotificationRequestsWithIdentifiers:toRemove];
    resolve(nil);
  }];
}

@end
