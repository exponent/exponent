//
//  ABI40_0_0AIRGoogleMapCalloutSubviewManager.m
//  AirMaps
//
//  Created by Denis Oblogin on 10/8/18.
//
//

#ifdef ABI40_0_0HAVE_GOOGLE_MAPS

#import "ABI40_0_0AIRGoogleMapCalloutSubviewManager.h"
#import "ABI40_0_0AIRGoogleMapCalloutSubview.h"
#import <ABI40_0_0React/ABI40_0_0RCTView.h>

@implementation ABI40_0_0AIRGoogleMapCalloutSubviewManager
ABI40_0_0RCT_EXPORT_MODULE()

- (UIView *)view
{
  ABI40_0_0AIRGoogleMapCalloutSubview *calloutSubview = [ABI40_0_0AIRGoogleMapCalloutSubview new];
  return calloutSubview;
}

ABI40_0_0RCT_EXPORT_VIEW_PROPERTY(onPress, ABI40_0_0RCTBubblingEventBlock)

@end

#endif
