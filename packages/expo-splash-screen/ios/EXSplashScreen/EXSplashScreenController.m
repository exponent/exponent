// Copyright © 2018 650 Industries. All rights reserved.

#import <EXSplashScreen/EXSplashScreenController.h>
#import <UMCore/UMDefines.h>

@interface EXSplashScreenController ()

@property (nonatomic, weak) UIViewController *viewController;
@property (nonatomic, strong) UIViewController *splashScreenViewController;
@property (nonatomic, strong) UIView *splashScreenView;
@property (nonatomic, strong) Class rootViewClass;
@property (nonatomic, weak) UIView *rootView;

@property (nonatomic, assign) BOOL autoHideEnabled;
@property (nonatomic, assign) BOOL splashScreenShown;
@property (nonatomic, assign) BOOL appContentAppeared;

@end

@implementation EXSplashScreenController

- (instancetype)initWithViewController:(UIViewController *)viewController
              splashScreenViewProvider:(id<EXSplashScreenViewProvider>)splashScreenViewProvider
{
  if (self = [super init]) {
    _viewController = viewController;
    _autoHideEnabled = YES;
    _splashScreenShown = NO;
    _appContentAppeared = NO;
    _splashScreenView = [splashScreenViewProvider createSplashScreenView];
  }
  return self;
}

# pragma mark public methods

- (void)showWithCallback:(void (^)(void))successCallback failureCallback:(void (^)(NSString * _Nonnull))failureCallback
{
  [self showWithCallback:successCallback];
}

- (void)showWithCallback:(nullable void(^)(void))successCallback
{
  UM_WEAKIFY(self);
  dispatch_async(dispatch_get_main_queue(), ^{
    UM_STRONGIFY(self);
    [self.viewController.view addSubview:self.splashScreenView];
    self.splashScreenShown = YES;
    if (successCallback) {
      successCallback();
    }
  });
}

- (void)preventAutoHideWithCallback:(void (^)(void))successCallback failureCallback:(void (^)(NSString * _Nonnull))failureCallback
{
  if (!_autoHideEnabled) {
    return failureCallback(@"Native SplashScreen autohiding is already prevented.");
  }
  self.autoHideEnabled = NO;
  successCallback();
}

- (void)hideWithCallback:(void (^)(void))successCallback failureCallback:(void (^)(NSString * _Nonnull))failureCallback
{
  if (!_splashScreenShown) {
    return failureCallback(@"Native SplashScreen is already hidden.");
  }
  
  [self hideWithCallback:successCallback];
}

- (void)hideWithCallback:(nullable void(^)(void))successCallback
{
  UM_WEAKIFY(self);
  dispatch_async(dispatch_get_main_queue(), ^{
    UM_STRONGIFY(self);
    [self.splashScreenView removeFromSuperview];
    self.splashScreenShown = NO;
    self.autoHideEnabled = YES;
    if (successCallback) {
      successCallback();
    }
  });
}

- (void)onAppContentDidAppear
{
  if (!_appContentAppeared && _autoHideEnabled) {
    _appContentAppeared = YES;
    [self hideWithCallback:nil];
  }
}

- (void)onAppContentWillReload
{
  if (!_appContentAppeared) {
    _autoHideEnabled = YES;
    _appContentAppeared = NO;
    [self showWithCallback:nil];
  }
}

@end
