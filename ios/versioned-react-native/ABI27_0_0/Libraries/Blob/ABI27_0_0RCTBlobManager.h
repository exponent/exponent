/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <ReactABI27_0_0/ABI27_0_0RCTBridge.h>
#import <ReactABI27_0_0/ABI27_0_0RCTBridgeModule.h>
#import <ReactABI27_0_0/ABI27_0_0RCTURLRequestHandler.h>

@interface ABI27_0_0RCTBlobManager : NSObject <ABI27_0_0RCTBridgeModule, ABI27_0_0RCTURLRequestHandler>

- (NSString *)store:(NSData *)data;

- (void)store:(NSData *)data withId:(NSString *)blobId;

- (NSData *)resolve:(NSDictionary<NSString *, id> *)blob;

- (NSData *)resolve:(NSString *)blobId offset:(NSInteger)offset size:(NSInteger)size;

- (NSData *)resolveURL:(NSURL *)url;

- (void)remove:(NSString *)blobId;

- (void)createFromParts:(NSArray<NSDictionary<NSString *, id> *> *)parts withId:(NSString *)blobId;

@end
