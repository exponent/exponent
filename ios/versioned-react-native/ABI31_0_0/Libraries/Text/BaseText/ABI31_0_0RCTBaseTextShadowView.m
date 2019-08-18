/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI31_0_0RCTBaseTextShadowView.h"

#import <ReactABI31_0_0/ABI31_0_0RCTShadowView+Layout.h>

#import "ABI31_0_0RCTRawTextShadowView.h"
#import "ABI31_0_0RCTVirtualTextShadowView.h"

NSString *const ABI31_0_0RCTBaseTextShadowViewEmbeddedShadowViewAttributeName = @"ABI31_0_0RCTBaseTextShadowViewEmbeddedShadowViewAttributeName";

@implementation ABI31_0_0RCTBaseTextShadowView
{
  NSAttributedString *_Nullable _cachedAttributedText;
  ABI31_0_0RCTTextAttributes *_Nullable _cachedTextAttributes;
}

- (instancetype)init
{
  if (self = [super init]) {
    _textAttributes = [ABI31_0_0RCTTextAttributes new];
  }

  return self;
}

- (void)setReactABI31_0_0Tag:(NSNumber *)ReactABI31_0_0Tag
{
  [super setReactABI31_0_0Tag:ReactABI31_0_0Tag];
  _textAttributes.tag = ReactABI31_0_0Tag;
}

#pragma mark - attributedString

- (NSAttributedString *)attributedTextWithBaseTextAttributes:(nullable ABI31_0_0RCTTextAttributes *)baseTextAttributes
{
  ABI31_0_0RCTTextAttributes *textAttributes;

  if (baseTextAttributes) {
    textAttributes = [baseTextAttributes copy];
    [textAttributes applyTextAttributes:self.textAttributes];
  } else {
    textAttributes = [self.textAttributes copy];
  }

  if (_cachedAttributedText && [_cachedTextAttributes isEqual:textAttributes]) {
    return _cachedAttributedText;
  }

  NSMutableAttributedString *attributedText = [NSMutableAttributedString new];

  [attributedText beginEditing];

  for (ABI31_0_0RCTShadowView *shadowView in self.ReactABI31_0_0Subviews) {
    // Special Case: ABI31_0_0RCTRawTextShadowView
    if ([shadowView isKindOfClass:[ABI31_0_0RCTRawTextShadowView class]]) {
      ABI31_0_0RCTRawTextShadowView *rawTextShadowView = (ABI31_0_0RCTRawTextShadowView *)shadowView;
      NSString *text = rawTextShadowView.text;
      if (text) {
        NSAttributedString *rawTextAttributedString =
          [[NSAttributedString alloc] initWithString:[textAttributes applyTextAttributesToText:text]
                                          attributes:textAttributes.effectiveTextAttributes];
        [attributedText appendAttributedString:rawTextAttributedString];
      }
      continue;
    }

    // Special Case: ABI31_0_0RCTBaseTextShadowView
    if ([shadowView isKindOfClass:[ABI31_0_0RCTBaseTextShadowView class]]) {
      ABI31_0_0RCTBaseTextShadowView *baseTextShadowView = (ABI31_0_0RCTBaseTextShadowView *)shadowView;
      NSAttributedString *baseTextAttributedString =
        [baseTextShadowView attributedTextWithBaseTextAttributes:textAttributes];
      [attributedText appendAttributedString:baseTextAttributedString];
      continue;
    }

    // Generic Case: Any ABI31_0_0RCTShadowView
    NSTextAttachment *attachment = [NSTextAttachment new];
    NSMutableAttributedString *embeddedShadowViewAttributedString = [NSMutableAttributedString new];
    [embeddedShadowViewAttributedString beginEditing];
    [embeddedShadowViewAttributedString appendAttributedString:[NSAttributedString attributedStringWithAttachment:attachment]];
    [embeddedShadowViewAttributedString addAttribute:ABI31_0_0RCTBaseTextShadowViewEmbeddedShadowViewAttributeName
                                               value:shadowView
                                               range:(NSRange){0, embeddedShadowViewAttributedString.length}];
    [embeddedShadowViewAttributedString endEditing];
    [attributedText appendAttributedString:embeddedShadowViewAttributedString];
  }

  [attributedText endEditing];

  [self clearLayout];

  _cachedAttributedText = [attributedText copy];
  _cachedTextAttributes = textAttributes;

  return _cachedAttributedText;
}

- (void)dirtyLayout
{
  [super dirtyLayout];
  _cachedAttributedText = nil;
  _cachedTextAttributes = nil;
}

- (void)didUpdateReactABI31_0_0Subviews
{
  [super didUpdateReactABI31_0_0Subviews];
  [self dirtyLayout];
}

- (void)didSetProps:(NSArray<NSString *> *)changedProps
{
  [super didSetProps:changedProps];
  [self dirtyLayout];
}

@end
