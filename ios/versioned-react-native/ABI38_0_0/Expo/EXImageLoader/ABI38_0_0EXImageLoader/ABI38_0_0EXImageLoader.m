// Copyright 2019-present 650 Industries. All rights reserved.

#import <ABI38_0_0EXImageLoader/ABI38_0_0EXImageLoader.h>
#import <ABI38_0_0React/ABI38_0_0RCTImageLoaderProtocol.h>

@interface ABI38_0_0EXImageLoader ()

@property (weak, nonatomic) ABI38_0_0RCTBridge *bridge;

@end

@implementation ABI38_0_0EXImageLoader

ABI38_0_0UM_REGISTER_MODULE();

+ (NSString *)moduleName
{
  return @"ABI38_0_0EXImageLoader";
}

+ (const NSArray<Protocol *> *)exportedInterfaces
{
  return @[@protocol(ABI38_0_0UMImageLoaderInterface)];
}

- (void)setBridge:(ABI38_0_0RCTBridge *)bridge
{
  _bridge = bridge;
}

- (void)loadImageForURL:(NSURL *)imageURL
      completionHandler:(ABI38_0_0UMImageLoaderCompletionBlock)completionHandler
{
  [[_bridge moduleForName:@"ImageLoader" lazilyLoadIfNecessary:YES] loadImageWithURLRequest:[NSURLRequest requestWithURL:imageURL]
                                                                  callback:^(NSError *error, UIImage *loadedImage) {
                                                                    completionHandler(error, loadedImage);
                                                                  }];
}

@end
