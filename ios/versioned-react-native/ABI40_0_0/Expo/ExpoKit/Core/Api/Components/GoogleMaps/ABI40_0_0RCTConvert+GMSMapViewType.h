//
//  ABI40_0_0RCTConvert+GMSMapViewType.h
//
//  Created by Nick Italiano on 10/23/16.
//

#ifdef ABI40_0_0HAVE_GOOGLE_MAPS

#import <Foundation/Foundation.h>
#import <GoogleMaps/GoogleMaps.h>
#import <ABI40_0_0React/ABI40_0_0RCTConvert.h>

@interface ABI40_0_0RCTConvert (GMSMapViewType)
+ (GMSCameraPosition*)GMSCameraPositionWithDefaults:(id)json existingCamera:(GMSCameraPosition*)existingCamera;
@end

#endif
