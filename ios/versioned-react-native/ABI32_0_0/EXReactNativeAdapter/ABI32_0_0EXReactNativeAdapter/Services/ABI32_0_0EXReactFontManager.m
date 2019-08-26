// Copyright 2018-present 650 Industries. All rights reserved.

#import <ABI32_0_0EXReactNativeAdapter/ABI32_0_0EXReactFontManager.h>
#import <ABI32_0_0EXFontInterface/ABI32_0_0EXFontProcessorInterface.h>
#import <ReactABI32_0_0/ABI32_0_0RCTFont.h>
#import <ABI32_0_0EXCore/ABI32_0_0EXAppLifecycleService.h>
#import <objc/runtime.h>

static dispatch_once_t initializeCurrentFontProcessorsOnce;

static NSPointerArray *currentFontProcessors;

@implementation ABI32_0_0RCTFont (ABI32_0_0EXReactFontManager)

+ (UIFont *)ABI32_0_0EXUpdateFont:(UIFont *)uiFont
              withFamily:(NSString *)family
                    size:(NSNumber *)size
                  weight:(NSString *)weight
                   style:(NSString *)style
                 variant:(NSArray<NSDictionary *> *)variant
         scaleMultiplier:(CGFloat)scaleMultiplier
{
  UIFont *font;
  for (id<ABI32_0_0EXFontProcessorInterface> fontProcessor in currentFontProcessors) {
    font = [fontProcessor updateFont:uiFont withFamily:family size:size weight:weight style:style variant:variant scaleMultiplier:scaleMultiplier];
    if (font) {
      return font;
    }
  }

  return [self ABI32_0_0EXUpdateFont:uiFont withFamily:family size:size weight:weight style:style variant:variant scaleMultiplier:scaleMultiplier];
}

@end

/**
 * This class is responsible for allowing other modules to register as font processors in ReactABI32_0_0 Native.
 *
 * A font processor is an object conforming to ABI32_0_0EXFontProcessorInterface and is capable of
 * providing an instance of UIFont for given (family, size, weight, style, variant, scaleMultiplier).
 *
 * To be able to hook into ReactABI32_0_0 Native's way of processing fonts we:
 *  - add a new class method to ABI32_0_0RCTFont, `ABI32_0_0EXUpdateFont:withFamily:size:weight:style:variant:scaleMultiplier`
 *    with ABI32_0_0EXReactFontManager category.
 *  - add a new static variable `currentFontProcessors` holding an array of... font processors. This variable
 *    is shared between the ABI32_0_0RCTFont's category and ABI32_0_0EXReactFontManager class.
 *  - when ABI32_0_0EXReactFontManager is initialized, we exchange implementations of ABI32_0_0RCTFont.updateFont...
 *    and ABI32_0_0RCTFont.ABI32_0_0EXUpdateFont... After the class initialized, which happens only once, calling `ABI32_0_0RCTFont updateFont`
 *    calls in fact implementation we've defined up here and calling `ABI32_0_0RCTFont ABI32_0_0EXUpdateFont` falls back
 *    to the default implementation. (This is why we call `[self ABI32_0_0EXUpdateFont]` at the end of that function,
 *    though it seems like an endless loop, in fact we dispatch to another implementation.)
 *  - When some module adds a font processor using ABI32_0_0EXFontManagerInterface, ABI32_0_0EXReactFontManager adds a weak pointer to it
 *    to currentFontProcessors array.
 *  - Implementation logic of `ABI32_0_0RCTFont.ABI32_0_0EXUpdateFont` uses current value of currentFontProcessors when processing arguments.
 */

@interface ABI32_0_0EXReactFontManager ()

@property (nonatomic, strong) NSMutableSet *fontProcessors;

@end

@implementation ABI32_0_0EXReactFontManager

ABI32_0_0EX_REGISTER_MODULE();

- (instancetype)init
{
  if (self = [super init]) {
    _fontProcessors = [NSMutableSet set];
  }
  return self;
}

+ (const NSArray<Protocol *> *)exportedInterfaces
{
  return @[@protocol(ABI32_0_0EXFontManagerInterface)];
}

+ (void)initialize
{
  dispatch_once(&initializeCurrentFontProcessorsOnce, ^{
    currentFontProcessors = [NSPointerArray weakObjectsPointerArray];
  });

  Class rtcClass = [ABI32_0_0RCTFont class];
  SEL rtcUpdate = @selector(updateFont:withFamily:size:weight:style:variant:scaleMultiplier:);
  SEL exUpdate = @selector(ABI32_0_0EXUpdateFont:withFamily:size:weight:style:variant:scaleMultiplier:);
  
  method_exchangeImplementations(class_getClassMethod(rtcClass, rtcUpdate),
                                 class_getClassMethod(rtcClass, exUpdate));
}

# pragma mark - ABI32_0_0EXFontManager

- (void)addFontProcessor:(id<ABI32_0_0EXFontProcessorInterface>)processor
{
  [_fontProcessors addObject:processor];
  [currentFontProcessors compact];
  [currentFontProcessors addPointer:(__bridge void * _Nullable)(processor)];
}

@end
