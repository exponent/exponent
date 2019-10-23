//  Copyright © 2019-present 650 Industries. All rights reserved.

#import <UMCore/UMEventEmitter.h>
#import <UMCore/UMExportedModule.h>
#import <UMCore/UMModuleRegistryConsumer.h>
#import <EXScreenOrientation/EXScreenOrientationRegistry.h>

typedef NS_ENUM(NSInteger, EXOrientation) {
  EXOrientationPortrait,
  EXOrientationPortraitUp,
  EXOrientationPortraitDown,
  EXOrientationLandscape,
  EXOrientationLandscapeLeft,
  EXOrientationLandscapeRight,
  EXOrientationUnknown
};

typedef NS_ENUM(NSInteger, EXOrientationLock) {
  EXOrientationDefaultLock,
  EXOrientationAllLock,
  EXOrientationPortraitLock,
  EXOrientationPortraitUpLock,
  EXOrientationPortraitDownLock,
  EXOrientationLandscapeLock,
  EXOrientationLandscapeLeftLock,
  EXOrientationLandscapeRightLock,
  EXOrientationOtherLock,
  EXOrientationAllButUpsideDownLock // deprecated
};

@interface EXScreenOrientationModule : UMExportedModule <UMModuleRegistryConsumer, UMEventEmitter>

- (UIInterfaceOrientationMask)orientationMask;
- (void)setOrientationMask:(UIInterfaceOrientationMask)mask;
+ (EXScreenOrientationRegistry *)sharedRegistry;

@end
