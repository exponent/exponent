/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI36_0_0RNCMaskedViewManager.h"

#import "ABI36_0_0RNCMaskedView.h"

@implementation ABI36_0_0RNCMaskedViewManager

ABI36_0_0RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [ABI36_0_0RNCMaskedView new];
}

@end
