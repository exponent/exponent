/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "ABI39_0_0RCTWrapperExampleViewController.h"

#import <ABI39_0_0RCTWrapper/ABI39_0_0RCTWrapper.h>

#import "ABI39_0_0RCTWrapperExampleView.h"

@implementation ABI39_0_0RCTWrapperExampleViewController

- (void)loadView {
  self.view = [ABI39_0_0RCTWrapperExampleView new];
}

@end

ABI39_0_0RCT_WRAPPER_FOR_VIEW_CONTROLLER(ABI39_0_0RCTWrapperExampleViewController)
