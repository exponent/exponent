/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI27_0_0RCTVirtualTextViewManager.h"

#import "ABI27_0_0RCTVirtualTextShadowView.h"

@implementation ABI27_0_0RCTVirtualTextViewManager

ABI27_0_0RCT_EXPORT_MODULE(ABI27_0_0RCTVirtualText)

- (UIView *)view
{
  return [UIView new];
}

- (ABI27_0_0RCTShadowView *)shadowView
{
  return [ABI27_0_0RCTVirtualTextShadowView new];
}

@end
