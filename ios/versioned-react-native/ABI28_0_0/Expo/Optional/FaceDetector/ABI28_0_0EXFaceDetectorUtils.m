//
//  ABI28_0_0EXFaceDetectorUtils.m
//  Exponent
//
//  Created by Stanisław Chmiela on 22.11.2017.
//  Copyright © 2017 650 Industries. All rights reserved.
//

#import "ABI28_0_0EXCameraUtils.h"
#import "ABI28_0_0EXFaceDetectorUtils.h"
#import "ABI28_0_0EXFaceDetectorPointTransformCalculator.h"

NSString *const ABI28_0_0EXGMVDataOutputWidthKey = @"Width";
NSString *const ABI28_0_0EXGMVDataOutputHeightKey = @"Height";

@implementation ABI28_0_0EXFaceDetectorUtils

+ (NSDictionary *)constantsToExport
{
  return @{
           @"Mode" : @{
               @"fast" : @(ABI28_0_0EXFaceDetectionFastMode),
               @"accurate" : @(ABI28_0_0EXFaceDetectionAccurateMode)
               },
           @"Landmarks" : @{
               @"all" : @(ABI28_0_0EXFaceDetectAllLandmarks),
               @"none" : @(ABI28_0_0EXFaceDetectNoLandmarks)
               },
           @"Classifications" : @{
               @"all" : @(ABI28_0_0EXFaceRunAllClassifications),
               @"none" : @(ABI28_0_0EXFaceRunNoClassifications)
               }
           };
}

# pragma mark - GMVDataOutput transformations

+ (CGAffineTransform)transformFromDeviceVideoOrientation:(AVCaptureVideoOrientation)deviceVideoOrientation toInterfaceVideoOrientation:(AVCaptureVideoOrientation)interfaceVideoOrientation videoWidth:(NSNumber *)width videoHeight:(NSNumber *)height
{
  ABI28_0_0EXFaceDetectorPointTransformCalculator *calculator = [[ABI28_0_0EXFaceDetectorPointTransformCalculator alloc] initToTransformFromOrientation:deviceVideoOrientation toOrientation:interfaceVideoOrientation forVideoWidth:[width floatValue] andVideoHeight:[height floatValue]];
  return [calculator transform];
}

// Normally we would use `dataOutput.xScale`, `.yScale` and `.offset`.
// Unfortunately, it turns out that using these attributes results in different results
// on iPhone {6, 7} and iPhone 5S. On newer iPhones the transform works properly,
// whereas on iPhone 5S the scale is too big (~0.7, while it should be ~0.4) and the offset
// moves the face points away. This workaround (using screen + orientation + video resolution
// to calculate proper scale) has been proven to work all three devices.
+ (CGAffineTransform)transformFromDeviceOutput:(GMVDataOutput *)dataOutput withInterfaceOrientation:(AVCaptureVideoOrientation)interfaceVideoOrientation
{
  UIScreen *mainScreen = [UIScreen mainScreen];
  BOOL interfaceIsLandscape = interfaceVideoOrientation == AVCaptureVideoOrientationLandscapeLeft || interfaceVideoOrientation == AVCaptureVideoOrientationLandscapeRight;
  CGFloat interfaceWidth = interfaceIsLandscape ? mainScreen.bounds.size.height : mainScreen.bounds.size.width;
  CGFloat interfaceHeight = interfaceIsLandscape ? mainScreen.bounds.size.width : mainScreen.bounds.size.height;
  CGFloat xScale = interfaceWidth / [(NSNumber *)dataOutput.videoSettings[ABI28_0_0EXGMVDataOutputHeightKey] floatValue];
  CGFloat yScale = interfaceHeight / [(NSNumber *)dataOutput.videoSettings[ABI28_0_0EXGMVDataOutputWidthKey] floatValue];
  CGAffineTransform dataOutputTransform = CGAffineTransformIdentity;
  dataOutputTransform = CGAffineTransformScale(dataOutputTransform, xScale, yScale);
  return dataOutputTransform;
}

+ (CGAffineTransform)transformFromDeviceOutput:(GMVDataOutput *)dataOutput toInterfaceVideoOrientation:(AVCaptureVideoOrientation)interfaceVideoOrientation
{
  UIDeviceOrientation currentDeviceOrientation = [[UIDevice currentDevice] orientation];
  AVCaptureVideoOrientation deviceVideoOrientation = [ABI28_0_0EXCameraUtils videoOrientationForDeviceOrientation:currentDeviceOrientation];
  
  NSNumber *videoWidth = dataOutput.videoSettings[ABI28_0_0EXGMVDataOutputWidthKey];
  NSNumber *videoHeight = dataOutput.videoSettings[ABI28_0_0EXGMVDataOutputHeightKey];
  
  CGAffineTransform interfaceTransform = [self transformFromDeviceVideoOrientation:deviceVideoOrientation toInterfaceVideoOrientation:interfaceVideoOrientation videoWidth:videoWidth videoHeight:videoHeight];
  
  CGAffineTransform dataOutputTransform = [self transformFromDeviceOutput:dataOutput withInterfaceOrientation:interfaceVideoOrientation];
  
  return CGAffineTransformConcat(interfaceTransform, dataOutputTransform);
}

@end
