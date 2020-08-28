/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <ABI39_0_0React/ABI39_0_0RCTBaseTextInputViewManager.h>

#import <ABI39_0_0React/ABI39_0_0RCTBridge.h>
#import <ABI39_0_0React/ABI39_0_0RCTConvert.h>
#import <ABI39_0_0React/ABI39_0_0RCTFont.h>
#import <ABI39_0_0React/ABI39_0_0RCTShadowView+Layout.h>
#import <ABI39_0_0React/ABI39_0_0RCTShadowView.h>
#import <ABI39_0_0React/ABI39_0_0RCTUIManager.h>
#import <ABI39_0_0React/ABI39_0_0RCTUIManagerUtils.h>
#import <ABI39_0_0React/ABI39_0_0RCTUIManagerObserverCoordinator.h>

#import <ABI39_0_0React/ABI39_0_0RCTBaseTextInputShadowView.h>
#import <ABI39_0_0React/ABI39_0_0RCTBaseTextInputView.h>
#import <ABI39_0_0React/ABI39_0_0RCTConvert+Text.h>

@interface ABI39_0_0RCTBaseTextInputViewManager () <ABI39_0_0RCTUIManagerObserver>

@end

@implementation ABI39_0_0RCTBaseTextInputViewManager
{
  NSHashTable<ABI39_0_0RCTBaseTextInputShadowView *> *_shadowViews;
}

ABI39_0_0RCT_EXPORT_MODULE()

#pragma mark - Unified <TextInput> properties

ABI39_0_0RCT_REMAP_VIEW_PROPERTY(autoCapitalize, backedTextInputView.autocapitalizationType, UITextAutocapitalizationType)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(autoCorrect, backedTextInputView.autocorrectionType, UITextAutocorrectionType)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(contextMenuHidden, backedTextInputView.contextMenuHidden, BOOL)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(editable, backedTextInputView.editable, BOOL)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(enablesReturnKeyAutomatically, backedTextInputView.enablesReturnKeyAutomatically, BOOL)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(keyboardAppearance, backedTextInputView.keyboardAppearance, UIKeyboardAppearance)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(placeholder, backedTextInputView.placeholder, NSString)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(placeholderTextColor, backedTextInputView.placeholderColor, UIColor)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(returnKeyType, backedTextInputView.returnKeyType, UIReturnKeyType)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(selectionColor, backedTextInputView.tintColor, UIColor)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(spellCheck, backedTextInputView.spellCheckingType, UITextSpellCheckingType)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(caretHidden, backedTextInputView.caretHidden, BOOL)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(clearButtonMode, backedTextInputView.clearButtonMode, UITextFieldViewMode)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(scrollEnabled, backedTextInputView.scrollEnabled, BOOL)
ABI39_0_0RCT_REMAP_VIEW_PROPERTY(secureTextEntry, backedTextInputView.secureTextEntry, BOOL)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(autoFocus, BOOL)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(blurOnSubmit, BOOL)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(clearTextOnFocus, BOOL)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(keyboardType, UIKeyboardType)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(maxLength, NSNumber)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(selectTextOnFocus, BOOL)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(selection, ABI39_0_0RCTTextSelection)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(inputAccessoryViewID, NSString)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(textContentType, NSString)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(passwordRules, NSString)

ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(onChange, ABI39_0_0RCTBubblingEventBlock)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(onSelectionChange, ABI39_0_0RCTDirectEventBlock)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(onTextInput, ABI39_0_0RCTDirectEventBlock)
ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(onScroll, ABI39_0_0RCTDirectEventBlock)

ABI39_0_0RCT_EXPORT_VIEW_PROPERTY(mostRecentEventCount, NSInteger)

ABI39_0_0RCT_EXPORT_SHADOW_PROPERTY(text, NSString)
ABI39_0_0RCT_EXPORT_SHADOW_PROPERTY(placeholder, NSString)
ABI39_0_0RCT_EXPORT_SHADOW_PROPERTY(onContentSizeChange, ABI39_0_0RCTBubblingEventBlock)

ABI39_0_0RCT_CUSTOM_VIEW_PROPERTY(multiline, BOOL, UIView)
{
  // No op.
  // This View Manager doesn't use this prop but it must be exposed here via ViewConfig to enable Fabric component use it.
}

- (ABI39_0_0RCTShadowView *)shadowView
{
  ABI39_0_0RCTBaseTextInputShadowView *shadowView = [[ABI39_0_0RCTBaseTextInputShadowView alloc] initWithBridge:self.bridge];
  shadowView.textAttributes.fontSizeMultiplier = [[[self.bridge
                                                    moduleForName:@"AccessibilityManager"
                                                    lazilyLoadIfNecessary:YES] valueForKey:@"multiplier"] floatValue];
  [_shadowViews addObject:shadowView];
  return shadowView;
}

- (void)setBridge:(ABI39_0_0RCTBridge *)bridge
{
  [super setBridge:bridge];

  _shadowViews = [NSHashTable weakObjectsHashTable];

  [bridge.uiManager.observerCoordinator addObserver:self];

  [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleDidUpdateMultiplierNotification)
                                               name:@"ABI39_0_0RCTAccessibilityManagerDidUpdateMultiplierNotification"
                                             object:[bridge moduleForName:@"AccessibilityManager"
                                                    lazilyLoadIfNecessary:YES]];
}

ABI39_0_0RCT_EXPORT_METHOD(focus : (nonnull NSNumber *)viewTag)
{
  [self.bridge.uiManager addUIBlock:^(ABI39_0_0RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    UIView *view = viewRegistry[viewTag];
    [view ABI39_0_0ReactFocus];
  }];
}

ABI39_0_0RCT_EXPORT_METHOD(blur : (nonnull NSNumber *)viewTag)
{
  [self.bridge.uiManager addUIBlock:^(ABI39_0_0RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    UIView *view = viewRegistry[viewTag];
    [view ABI39_0_0ReactBlur];
  }];
}

ABI39_0_0RCT_EXPORT_METHOD(setTextAndSelection : (nonnull NSNumber *)viewTag
                 mostRecentEventCount : (NSInteger)mostRecentEventCount
                                value : (NSString *)value
                                start : (NSInteger)start
                                  end : (NSInteger)end)
{
  [self.bridge.uiManager addUIBlock:^(ABI39_0_0RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
    ABI39_0_0RCTBaseTextInputView *view = (ABI39_0_0RCTBaseTextInputView *)viewRegistry[viewTag];
    NSInteger eventLag = view.nativeEventCount - mostRecentEventCount;
    if (eventLag != 0) {
      return;
    }
    ABI39_0_0RCTExecuteOnUIManagerQueue(^{
      ABI39_0_0RCTBaseTextInputShadowView *shadowView = (ABI39_0_0RCTBaseTextInputShadowView *)[self.bridge.uiManager shadowViewForABI39_0_0ReactTag:viewTag];
      [shadowView setText:value];
      [self.bridge.uiManager setNeedsLayout];
      ABI39_0_0RCTExecuteOnMainQueue(^{
        [view setSelectionStart:start selectionEnd:end];
      });
    });
  }];
}

#pragma mark - ABI39_0_0RCTUIManagerObserver

- (void)uiManagerWillPerformMounting:(__unused ABI39_0_0RCTUIManager *)uiManager
{
  for (ABI39_0_0RCTBaseTextInputShadowView *shadowView in _shadowViews) {
    [shadowView uiManagerWillPerformMounting];
  }
}

#pragma mark - Font Size Multiplier

- (void)handleDidUpdateMultiplierNotification
{
  CGFloat fontSizeMultiplier = [[[self.bridge moduleForName:@"AccessibilityManager"]
                                 valueForKey:@"multiplier"] floatValue];

  NSHashTable<ABI39_0_0RCTBaseTextInputShadowView *> *shadowViews = _shadowViews;
  ABI39_0_0RCTExecuteOnUIManagerQueue(^{
    for (ABI39_0_0RCTBaseTextInputShadowView *shadowView in shadowViews) {
      shadowView.textAttributes.fontSizeMultiplier = fontSizeMultiplier;
      [shadowView dirtyLayout];
    }

    [self.bridge.uiManager setNeedsLayout];
  });
}

@end
