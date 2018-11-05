/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI30_0_0RNSVGTSpanManager.h"

#import "ABI30_0_0RNSVGTSpan.h"
#import "ABI30_0_0RCTConvert+RNSVG.h"

@implementation ABI30_0_0RNSVGTSpanManager

ABI30_0_0RCT_EXPORT_MODULE()

- (ABI30_0_0RNSVGRenderable *)node
{
  return [ABI30_0_0RNSVGTSpan new];
}

ABI30_0_0RCT_EXPORT_VIEW_PROPERTY(content, NSString)

@end
