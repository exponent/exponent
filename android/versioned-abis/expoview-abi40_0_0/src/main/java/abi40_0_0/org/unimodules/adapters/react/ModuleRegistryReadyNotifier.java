package abi40_0_0.org.unimodules.adapters.react;

import abi40_0_0.com.facebook.react.bridge.BaseJavaModule;
import abi40_0_0.com.facebook.react.bridge.NativeModule;

import abi40_0_0.org.unimodules.core.ModuleRegistry;

/**
 * {@link ModuleRegistryReadyNotifier} is exported as a native module
 * to React Native and when {@link abi40_0_0.com.facebook.react.ReactInstanceManager}
 * notifies {@link abi40_0_0.com.facebook.react.bridge.NativeModule} of being ready
 * ({@link NativeModule#initialize()}) it delegates the call to {@link ModuleRegistry}.
 */
public class ModuleRegistryReadyNotifier extends BaseJavaModule {
  private ModuleRegistry mModuleRegistry;

  public ModuleRegistryReadyNotifier(ModuleRegistry moduleRegistry) {
    mModuleRegistry = moduleRegistry;
  }

  @Override
  public String getName() {
    return null;
  }

  @Override
  public void initialize() {
    mModuleRegistry.ensureIsInitialized();
  }
}
