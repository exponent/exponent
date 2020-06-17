// Copyright 2016-present 650 Industries. All rights reserved.

#import <AVFoundation/AVFoundation.h>
#import <EXBarCodeScanner/EXBarCodeScannerUtils.h>

@implementation EXBarCodeScannerUtils

+ (NSDictionary *)validBarCodeTypes
{
  return @{
           @"upc_e" : AVMetadataObjectTypeUPCECode,
           @"code39" : AVMetadataObjectTypeCode39Code,
           @"code39mod43" : AVMetadataObjectTypeCode39Mod43Code,
           @"ean13" : AVMetadataObjectTypeEAN13Code,
           @"ean8" : AVMetadataObjectTypeEAN8Code,
           @"code93" : AVMetadataObjectTypeCode93Code,
           @"code128" : AVMetadataObjectTypeCode128Code,
           @"pdf417" : AVMetadataObjectTypePDF417Code,
           @"qr" : AVMetadataObjectTypeQRCode,
           @"aztec" : AVMetadataObjectTypeAztecCode,
           @"interleaved2of5" : AVMetadataObjectTypeInterleaved2of5Code,
           @"itf14" : AVMetadataObjectTypeITF14Code,
           @"datamatrix" : AVMetadataObjectTypeDataMatrixCode,
           };
}

+ (AVCaptureVideoOrientation)videoOrientationForInterfaceOrientation:(UIInterfaceOrientation)orientation
{
  switch (orientation) {
    case UIInterfaceOrientationPortrait:
      return AVCaptureVideoOrientationPortrait;
    case UIInterfaceOrientationPortraitUpsideDown:
      return AVCaptureVideoOrientationPortraitUpsideDown;
    case UIInterfaceOrientationLandscapeRight:
      return AVCaptureVideoOrientationLandscapeRight;
    case UIInterfaceOrientationLandscapeLeft:
      return AVCaptureVideoOrientationLandscapeLeft;
    default:
      return 0;
  }
}

+ (AVCaptureDevice *)deviceWithMediaType:(AVMediaType)mediaType
                      preferringPosition:(AVCaptureDevicePosition)position
{
  return [AVCaptureDevice defaultDeviceWithDeviceType:AVCaptureDeviceTypeBuiltInWideAngleCamera mediaType:mediaType position:position];
}

+ (NSDictionary *)ciqeCodeFeatureToDicitionary:(CIQRCodeFeature *)barCodeScannerResult barCodeType:(NSString *)type
{
  NSMutableDictionary *result = [NSMutableDictionary new];
  result[@"type"] = type;
  result[@"data"] = barCodeScannerResult.messageString;
  
  if (!CGRectIsEmpty(barCodeScannerResult.bounds)) {
    NSMutableArray<NSDictionary *> *cornerPointsResult = [NSMutableArray new];
    for (NSValue *nsPoint in @[
      [NSValue valueWithCGPoint:barCodeScannerResult.topLeft],
      [NSValue valueWithCGPoint:barCodeScannerResult.topRight],
      [NSValue valueWithCGPoint:barCodeScannerResult.bottomRight],
      [NSValue valueWithCGPoint:barCodeScannerResult.bottomLeft]
    ]) {
      CGPoint point = [nsPoint CGPointValue];
      [cornerPointsResult addObject:@{
        @"x": @(point.x),
        @"y": @(point.y)
      }];
    }
    
    result[@"cornerPoints"] = cornerPointsResult;
    result[@"bounds"] = @{
      @"origin": @{
          @"x": @(barCodeScannerResult.bounds.origin.x),
          @"y": @(barCodeScannerResult.bounds.origin.y),
      },
      @"size": @{
          @"width": @(barCodeScannerResult.bounds.size.width),
          @"width": @(barCodeScannerResult.bounds.size.height),
      }
    };
  }

  return result;
}

+ (NSDictionary *)avMetadataCodeObjectToDicitionary:(AVMetadataMachineReadableCodeObject *)barCodeScannerResult
{
  NSMutableDictionary *result = [NSMutableDictionary new];
  result[@"type"] = barCodeScannerResult.type;
  result[@"data"] = barCodeScannerResult.stringValue;
  
  if (barCodeScannerResult.corners.count) {
    result[@"cornerPoints"] = barCodeScannerResult.corners;
    result[@"bounds"] = @{
      @"origin": @{
          @"x": @(barCodeScannerResult.bounds.origin.x),
          @"y": @(barCodeScannerResult.bounds.origin.y),
      },
      @"size": @{
          @"width": @(barCodeScannerResult.bounds.size.width),
          @"height": @(barCodeScannerResult.bounds.size.height),
      }
    };
  }
  return result;
}

+ (NSDictionary *)zxResultToDicitionary:(ZXResult *)barCodeScannerResult
{
  NSMutableDictionary *result = [NSMutableDictionary new];
  result[@"type"] = [EXBarCodeScannerUtils zxingFormatToString:barCodeScannerResult.barcodeFormat];
  
  // text contains characteres u'\0' (null character) that malforme resulting string, so we get rid of them
  NSMutableString* data = [NSMutableString new];
  for (int i = 0; i < [barCodeScannerResult.text length]; i++) {
    if ([barCodeScannerResult.text characterAtIndex:i] != u'\0') {
      [data appendFormat:@"%c", [barCodeScannerResult.text characterAtIndex:i]];
    }
  }
  result[@"data"] = data;
  
  [EXBarCodeScannerUtils attachTo:result cornerPointsAndBoundingBoxFrom:barCodeScannerResult.resultPoints];
  
  return result;
}

+ (void)attachTo:(NSMutableDictionary *)dictionary cornerPointsAndBoundingBoxFrom:(NSArray<ZXResultPoint *> *)points
{
  if (!points.count) {
    return;
  }
  
  float minX = FLT_MAX;
  float minY = FLT_MAX;
  float maxX = FLT_MIN;
  float maxY = FLT_MIN;
  
  NSMutableArray<NSDictionary *> *cornerPointsResult = [NSMutableArray new];
  for (ZXResultPoint *point in points) {
    minX = MIN(minX, point.x);
    minY = MIN(minY, point.y);
    maxX = MAX(maxX, point.x);
    maxY = MAX(maxY, point.y);
    
    [cornerPointsResult addObject:@{
      @"x": @(point.x),
      @"y": @(point.y)
    }];
  }
  
  dictionary[@"cornerPoints"] = cornerPointsResult;
  dictionary[@"bounds"] = @{
    @"origin": @{
        @"x": @(minX),
        @"y": @(minY),
    },
    @"size": @{
        @"width": @(maxX - minX),
        @"width": @(maxY - minY),
    }
  };
}

+ (NSString *)zxingFormatToString:(ZXBarcodeFormat)format
{
  switch (format) {
    case kBarcodeFormatPDF417:
      return AVMetadataObjectTypePDF417Code;
    case kBarcodeFormatCode39:
      return AVMetadataObjectTypeCode39Code;
    default:
      return @"unknown";
  }
}


@end
