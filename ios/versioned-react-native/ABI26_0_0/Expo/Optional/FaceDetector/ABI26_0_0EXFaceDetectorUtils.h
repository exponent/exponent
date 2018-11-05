//
//  ABI26_0_0EXFaceDetectorUtils.h
//  Exponent
//
//  Created by Stanisław Chmiela on 22.11.2017.
//  Copyright © 2017 650 Industries. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <CoreMedia/CoreMedia.h>
#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>
#import <GoogleMVDataOutput/GoogleMVDataOutput.h>

typedef NS_ENUM(NSInteger, ABI26_0_0EXFaceDetectionMode) {
  ABI26_0_0EXFaceDetectionFastMode = GMVDetectorFaceFastMode,
  ABI26_0_0EXFaceDetectionAccurateMode = GMVDetectorFaceAccurateMode
};

typedef NS_ENUM(NSInteger, ABI26_0_0EXFaceDetectionLandmarks) {
  ABI26_0_0EXFaceDetectAllLandmarks = GMVDetectorFaceLandmarkAll,
  ABI26_0_0EXFaceDetectNoLandmarks = GMVDetectorFaceLandmarkNone
};

typedef NS_ENUM(NSInteger, ABI26_0_0EXFaceDetectionClassifications) {
  ABI26_0_0EXFaceRunAllClassifications = GMVDetectorFaceClassificationAll,
  ABI26_0_0EXFaceRunNoClassifications = GMVDetectorFaceClassificationNone
};

@interface ABI26_0_0EXFaceDetectorUtils : NSObject

+ (NSDictionary *)constantsToExport;

+ (CGAffineTransform)transformFromDeviceOutput:(GMVDataOutput *)dataOutput toInterfaceVideoOrientation:(AVCaptureVideoOrientation)interfaceVideoOrientation;

@end
