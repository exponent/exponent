// Copyright 2018-present 650 Industries. All rights reserved.

#import "EXScopedNotificationBuilder.h"

@interface EXScopedNotificationBuilder ()

@property (nonatomic, strong) NSString *experienceId;
@property (nonatomic, assign) BOOL isInExpoGo;

@end

@implementation EXScopedNotificationBuilder

- (instancetype)initWithExperienceId:(NSString *)experienceId
                 andConstantsBinding:(EXConstantsBinding *)constantsBinding
{
  if (self = [super init]) {
    _experienceId = experienceId;
    _isInExpoGo = [@"expo" isEqualToString:constantsBinding.appOwnership];
  }
  
  return self;
}

- (UNNotificationContent *)notificationContentFromRequest:(NSDictionary *)request
{
  UNMutableNotificationContent *content = [super notificationContentFromRequest:request];
  NSMutableDictionary *userInfo = [content.userInfo mutableCopy];
  if (!userInfo) {
    userInfo = [NSMutableDictionary dictionary];
  }
  userInfo[@"experienceId"] = _experienceId;
  [content setUserInfo:userInfo];
  
  if (content.categoryIdentifier && _isInExpoGo) {
    NSString *categoryIdentifier = [NSString stringWithFormat:@"%@-%@", _experienceId, content.categoryIdentifier];
    [content setCategoryIdentifier:categoryIdentifier];
  }
  
  return content;
}

@end
