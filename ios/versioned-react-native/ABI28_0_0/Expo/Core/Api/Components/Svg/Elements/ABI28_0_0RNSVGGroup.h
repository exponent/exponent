/**
 * Copyright (c) 2015-present, Horcrux.
 * All rights reserved.
 *
 * This source code is licensed under the MIT-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "ABI28_0_0RNSVGContainer.h"
#import "ABI28_0_0RNSVGCGFCRule.h"
#import "ABI28_0_0RNSVGSvgView.h"
#import "ABI28_0_0RNSVGPath.h"
#import "ABI28_0_0RNSVGGlyphContext.h"

@interface ABI28_0_0RNSVGGroup : ABI28_0_0RNSVGPath <ABI28_0_0RNSVGContainer>

@property (nonatomic, strong) NSDictionary *font;

- (void)renderPathTo:(CGContextRef)context;
- (void)renderGroupTo:(CGContextRef)context;

- (ABI28_0_0RNSVGGlyphContext *)getGlyphContext;
- (void)pushGlyphContext;
- (void)popGlyphContext;
@end
