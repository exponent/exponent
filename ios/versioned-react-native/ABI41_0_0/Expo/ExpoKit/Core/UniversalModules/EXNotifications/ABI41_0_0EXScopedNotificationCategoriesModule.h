// Copyright 2018-present 650 Industries. All rights reserved.

#if __has_include(<ABI41_0_0EXNotifications/ABI41_0_0EXNotificationCategoriesModule.h>)

#import <ABI41_0_0EXNotifications/ABI41_0_0EXNotificationCategoriesModule.h>
#import "ABI41_0_0EXConstantsBinding.h"

NS_ASSUME_NONNULL_BEGIN

@interface ABI41_0_0EXScopedNotificationCategoriesModule : ABI41_0_0EXNotificationCategoriesModule

- (instancetype)initWithScopeKey:(NSString *)scopeKey
                 andConstantsBinding:(ABI41_0_0EXConstantsBinding *)constantsBinding;

+ (void)maybeMigrateLegacyCategoryIdentifiersForProjectWithExperienceStableLegacyId:(NSString *)experienceStableLegacyId
                                                                 scopeKey:(NSString *)scopeKey
                                                                         isInExpoGo:(BOOL)isInExpoGo;

@end

NS_ASSUME_NONNULL_END

#endif
