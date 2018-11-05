/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>

#import <ReactABI27_0_0/ABI27_0_0RCTBridge.h>
#import <ReactABI27_0_0/ABI27_0_0RCTBridgeModule.h>

extern NSString *const ABI27_0_0RCTAccessibilityManagerDidUpdateMultiplierNotification; // posted when multiplier is changed

@interface ABI27_0_0RCTAccessibilityManager : NSObject <ABI27_0_0RCTBridgeModule>

@property (nonatomic, readonly) CGFloat multiplier;

/// map from UIKit categories to multipliers
@property (nonatomic, copy) NSDictionary<NSString *, NSNumber *> *multipliers;

@property (nonatomic, assign) BOOL isVoiceOverEnabled;

@end

@interface ABI27_0_0RCTBridge (ABI27_0_0RCTAccessibilityManager)

@property (nonatomic, readonly) ABI27_0_0RCTAccessibilityManager *accessibilityManager;

@end
