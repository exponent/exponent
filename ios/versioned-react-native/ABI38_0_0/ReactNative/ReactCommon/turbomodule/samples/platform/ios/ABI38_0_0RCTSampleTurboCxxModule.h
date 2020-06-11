/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#pragma once

#import <ABI38_0_0React/ABI38_0_0RCTCxxModule.h>
#import <ABI38_0_0ReactCommon/ABI38_0_0RCTTurboModule.h>

/**
 * Sample backward-compatible ABI38_0_0RCTCxxModule-based module.
 * With jsi::HostObject, this class is no longer necessary, but the system supports it for
 * backward compatibility.
 */
@interface ABI38_0_0RCTSampleTurboCxxModule_v1 : ABI38_0_0RCTCxxModule <ABI38_0_0RCTTurboModule>

@end

/**
 * Second variant of a sample backward-compatible ABI38_0_0RCTCxxModule-based module.
 */
@interface ABI38_0_0RCTSampleTurboCxxModule_v2 : ABI38_0_0RCTCxxModule <ABI38_0_0RCTTurboModule>

@end
