// Copyright 2016-present 650 Industries. All rights reserved.

#import <EXPermissions/EXPermissions.h>

FOUNDATION_EXPORT NSString * const EXAppDidRegisterForRemoteNotificationsNotificationName;

@interface EXRemoteNotificationRequester : EXPermissionBaseRequester <EXPermissionRequesterDelegate>

@end
