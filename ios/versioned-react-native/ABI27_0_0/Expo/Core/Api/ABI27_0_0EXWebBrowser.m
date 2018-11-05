// Copyright 2015-present 650 Industries. All rights reserved.

#import <ReactABI27_0_0/ABI27_0_0RCTUtils.h>
#import <SafariServices/SafariServices.h>
#import "ABI27_0_0EXWebBrowser.h"
#import "ABI27_0_0EXUnversioned.h"
#import "ABI27_0_0EXUtil.h"

@interface ABI27_0_0EXWebBrowser () <SFSafariViewControllerDelegate>

@property (nonatomic, copy) ABI27_0_0RCTPromiseResolveBlock redirectResolve;
@property (nonatomic, copy) ABI27_0_0RCTPromiseRejectBlock redirectReject;

#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wpartial-availability"
@property (nonatomic, strong) SFAuthenticationSession *authSession;
#pragma clang diagnostic pop

@end

NSString *ABI27_0_0EXWebBrowserErrorCode = @"ABI27_0_0EXWebBrowser";


@implementation ABI27_0_0EXWebBrowser
{
  UIStatusBarStyle _initialStatusBarStyle;
}

ABI27_0_0RCT_EXPORT_MODULE(ExponentWebBrowser)

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}


ABI27_0_0RCT_EXPORT_METHOD(openAuthSessionAsync:(NSString *)authURL
                  redirectURL:(NSString *)redirectURL
                  resolver:(ABI27_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(ABI27_0_0RCTPromiseRejectBlock)reject)
{
  [self initializeWebBrowserWithResolver:resolve andRejecter:reject];


  if (@available(iOS 11, *)) {
    NSURL *url = [[NSURL alloc] initWithString: authURL];
    _authSession = [[SFAuthenticationSession alloc]
              initWithURL:url
        callbackURLScheme:redirectURL
        completionHandler:^(NSURL* _Nullable callbackURL, NSError* _Nullable error) {
            if (!error) {
                NSString *url = callbackURL.absoluteString;
                _redirectResolve(@{
                    @"type" : @"success",
                    @"url" : url,
                });
            } else {
                _redirectResolve(@{
                    @"type" : @"cancel",
                });
            }
            [self flowDidFinish];
        }];
    [_authSession start];
  } else {
      resolve(@{
          @"type" : @"cancel",
          @"message" : @"openAuthSessionAsync requires iOS 11 or greater"
      });
      [self flowDidFinish];
  }
}


ABI27_0_0RCT_EXPORT_METHOD(openBrowserAsync:(NSString *)authURL
                  resolver:(ABI27_0_0RCTPromiseResolveBlock)resolve
                  rejecter:(ABI27_0_0RCTPromiseRejectBlock)reject)
{
  if (![self initializeWebBrowserWithResolver:resolve andRejecter:reject]) {
    return;
  }
  
  // Safari View Controller to authorize request
  NSURL *url = [[NSURL alloc] initWithString:authURL];
  SFSafariViewController *safariVC = [[SFSafariViewController alloc] initWithURL:url entersReaderIfAvailable:NO];
  safariVC.delegate = self;
  
 // By setting the modal presentation style to OverFullScreen, we disable the "Swipe to dismiss"
 // gesture that is causing a bug where sometimes `safariViewControllerDidFinish` is not called.
 // There are bugs filed already about it on OpenRadar.
 [safariVC setModalPresentationStyle: UIModalPresentationOverFullScreen];
  
 // This is a hack to present the SafariViewController modally
 UINavigationController *safariHackVC = [[UINavigationController alloc] initWithRootViewController:safariVC];
 [safariHackVC setNavigationBarHidden:true animated:false];
 [ABI27_0_0RCTPresentedViewController() presentViewController:safariHackVC animated:true completion:nil];
}

- (void)_dismissBrowser
{
  __weak typeof(self) weakSelf = self;
  [ABI27_0_0EXUtil performSynchronouslyOnMainThread:^{
    [ABI27_0_0RCTPresentedViewController() dismissViewControllerAnimated:YES completion:^{
      __strong typeof(self) strongSelf = weakSelf;
      if (strongSelf) {
        strongSelf.redirectResolve(@{
                                     @"type": @"dismiss",
                                     });
        [strongSelf flowDidFinish];
      }
    }];
  }];
}

ABI27_0_0RCT_EXPORT_METHOD(dismissBrowser) {
  [self _dismissBrowser];
}

ABI27_0_0RCT_EXPORT_METHOD(dismissAuthSession) {
  if (@available(iOS 11, *)) {
    [_authSession cancel];
    if (_redirectResolve) {
      _redirectResolve(@{
        @"type": @"dismiss"
      });

      [self flowDidFinish];
    }
  } else {
    [self dismissBrowser];
  }
}

/**
 * Helper that is used in openBrowserAsync and openAuthSessionAsync
 */
- (BOOL)initializeWebBrowserWithResolver:(ABI27_0_0RCTPromiseResolveBlock)resolve andRejecter:(ABI27_0_0RCTPromiseRejectBlock)reject {
  if (_redirectResolve) {
    reject(ABI27_0_0EXWebBrowserErrorCode, @"Another WebBrowser is already being presented.", nil);
    return NO;
  }
  _redirectReject = reject;
  _redirectResolve = resolve;
  
  _initialStatusBarStyle = ABI27_0_0RCTSharedApplication().statusBarStyle;
  
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  [ABI27_0_0RCTSharedApplication() setStatusBarStyle:UIStatusBarStyleDefault
                                   animated:YES];
#pragma clang diagnostic pop
  return YES;
}

/**
 * Called when the user dismisses the SFVC without logging in.
 */
- (void)safariViewControllerDidFinish:(SFSafariViewController *)controller
{
  _redirectResolve(@{
    @"type": @"cancel",
  });
  [self flowDidFinish];
}

-(void)flowDidFinish
{
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
  [ABI27_0_0RCTSharedApplication() setStatusBarStyle:_initialStatusBarStyle animated:YES];
#pragma clang diagnostic pop
  _redirectResolve = nil;
  _redirectReject = nil;
}

@end
