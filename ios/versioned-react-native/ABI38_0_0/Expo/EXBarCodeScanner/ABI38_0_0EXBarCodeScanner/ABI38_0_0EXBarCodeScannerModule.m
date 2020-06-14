// Copyright 2016-present 650 Industries. All rights reserved.

#import <ABI38_0_0EXBarCodeScanner/ABI38_0_0EXBarCodeScannerModule.h>
#import <ABI38_0_0EXBarCodeScanner/ABI38_0_0EXBarCodeScannerUtils.h>
#import <ABI38_0_0EXBarCodeScanner/ABI38_0_0EXBarCodeCameraRequester.h>
#import <ABI38_0_0UMImageLoaderInterface/ABI38_0_0UMImageLoaderInterface.h>
#import <ABI38_0_0UMPermissionsInterface/ABI38_0_0UMPermissionsInterface.h>
#import <ABI38_0_0UMPermissionsInterface/ABI38_0_0UMPermissionsMethodsDelegate.h>

@interface ABI38_0_0EXBarCodeScannerModule ()

@property (nonatomic, weak) ABI38_0_0UMModuleRegistry *moduleRegistry;
@property (nonatomic, weak) id<ABI38_0_0UMImageLoaderInterface> imageLoader;
@property (nonatomic, weak) id<ABI38_0_0UMPermissionsInterface> permissionsManager;

@end

@implementation ABI38_0_0EXBarCodeScannerModule

ABI38_0_0UM_EXPORT_MODULE(ExpoBarCodeScannerModule);

- (void)setModuleRegistry:(ABI38_0_0UMModuleRegistry *)moduleRegistry
{
  _moduleRegistry = moduleRegistry;
  _imageLoader = [moduleRegistry getModuleImplementingProtocol:@protocol(ABI38_0_0UMImageLoaderInterface)];
  _permissionsManager = [moduleRegistry getModuleImplementingProtocol:@protocol(ABI38_0_0UMPermissionsInterface)];
  [ABI38_0_0UMPermissionsMethodsDelegate registerRequesters:@[[ABI38_0_0EXBareCodeCameraRequester new]] withPermissionsManager:_permissionsManager];
}

- (NSDictionary *)constantsToExport
{
  return @{
           @"Type": @{
               @"front": @(ABI38_0_0EXCameraTypeFront),
               @"back" : @(ABI38_0_0EXCameraTypeBack),
               },
           @"BarCodeType": [ABI38_0_0EXBarCodeScannerUtils validBarCodeTypes],
           };
}

ABI38_0_0UM_EXPORT_METHOD_AS(getPermissionsAsync,
                    getPermissionsAsync:(ABI38_0_0UMPromiseResolveBlock)resolve
                    rejecter:(ABI38_0_0UMPromiseRejectBlock)reject)
{
  [ABI38_0_0UMPermissionsMethodsDelegate getPermissionWithPermissionsManager:_permissionsManager
                                                      withRequester:[ABI38_0_0EXBareCodeCameraRequester class]
                                                            resolve:resolve
                                                             reject:reject];
}

ABI38_0_0UM_EXPORT_METHOD_AS(requestPermissionsAsync,
                    requestPermissionsAsync:(ABI38_0_0UMPromiseResolveBlock)resolve
                    rejecter:(ABI38_0_0UMPromiseRejectBlock)reject)
{
  [ABI38_0_0UMPermissionsMethodsDelegate askForPermissionWithPermissionsManager:_permissionsManager
                                                         withRequester:[ABI38_0_0EXBareCodeCameraRequester class]
                                                               resolve:resolve
                                                                reject:reject];
}

ABI38_0_0UM_EXPORT_METHOD_AS(scanFromURLAsync,
                    scanFromURLAsync:(NSString *)url
                    barCodeTypes:(NSArray *)barCodeTypes
                    resolver:(ABI38_0_0UMPromiseResolveBlock)resolve
                    rejecter:(ABI38_0_0UMPromiseRejectBlock)reject)
{
  // We only support QR codes, so barCodeTypes is ignored
  NSURL *imageURL = [NSURL URLWithString:url];
  [_imageLoader loadImageForURL:imageURL completionHandler:^(NSError *error, UIImage *loadedImage) {
    if (error != nil) {
      reject(@"E_IMAGE_RETRIEVAL_ERROR", @"Could not get the image", error);
      return;
    }
    
    CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode
                                              context:nil
                                              options:@{CIDetectorAccuracy:CIDetectorAccuracyHigh}];
    if (detector)  {
      NSArray *features = [detector featuresInImage:[[CIImage alloc] initWithCGImage:loadedImage.CGImage]];
      
      NSMutableArray *result = [NSMutableArray arrayWithCapacity:1];
      for (CIQRCodeFeature *feature in features)  {
        [result addObject:@{
                            @"type" : AVMetadataObjectTypeQRCode,
                            @"data" : feature.messageString
                            }];
      }
      
      resolve(result);
    } else {
      reject(@"E_SCANNER_INIT_FAILED", @"Could not initialize the barcode scanner", nil);
    }
  }];
}

@end
