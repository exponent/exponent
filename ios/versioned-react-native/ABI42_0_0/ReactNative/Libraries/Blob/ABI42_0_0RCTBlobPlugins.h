/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @generated by an internal plugin build system
 */

#ifdef ABI42_0_0RN_DISABLE_OSS_PLUGIN_HEADER

// FB Internal: FBABI42_0_0RCTBlobPlugins.h is autogenerated by the build system.
#import <ABI42_0_0React/ABI42_0_0FBABI42_0_0RCTBlobPlugins.h>

#else

// OSS-compatibility layer

#import <Foundation/Foundation.h>

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wreturn-type-c-linkage"

#ifdef __cplusplus
extern "C" {
#endif

// ABI42_0_0RCTTurboModuleManagerDelegate should call this to resolve module classes.
Class ABI42_0_0RCTBlobClassProvider(const char *name);

// Lookup functions
Class ABI42_0_0RCTFileReaderModuleCls(void) __attribute__((used));
Class ABI42_0_0RCTBlobManagerCls(void) __attribute__((used));

#ifdef __cplusplus
}
#endif

#pragma GCC diagnostic pop

#endif // ABI42_0_0RN_DISABLE_OSS_PLUGIN_HEADER
