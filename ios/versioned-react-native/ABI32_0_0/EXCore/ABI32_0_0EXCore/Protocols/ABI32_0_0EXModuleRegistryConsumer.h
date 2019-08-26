// Copyright © 2018 650 Industries. All rights reserved.

#import <Foundation/Foundation.h>
#import <ABI32_0_0EXCore/ABI32_0_0EXModuleRegistry.h>

// Implement this protocol in any module registered
// in ABI32_0_0EXModuleRegistry to receive an instance of the module registry
// when it's initialized (ready to provide references to other modules).

@protocol ABI32_0_0EXModuleRegistryConsumer <NSObject>

- (void)setModuleRegistry:(ABI32_0_0EXModuleRegistry *)moduleRegistry;

@end
