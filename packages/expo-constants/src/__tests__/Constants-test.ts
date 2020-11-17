import Constants, { ExecutionEnvironment } from '../Constants';

it(`defines a manifest`, () => {
  expect(Constants.manifest).toBeTruthy();
  expect(typeof Constants.manifest).toBe('object');
});

it(`defines a linking URI and URL`, () => {
  expect(typeof Constants.linkingUri).toBe('string');
  expect(Constants.linkingUri).toBe(Constants.linkingUrl);
});

describe(`manifest`, () => {
  const fakeManifest = { id: '@jester/manifest' };
  const fakeManifest2 = { id: '@jester/manifest2' };

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.dontMock('../ExponentConstants');
    jest.dontMock('@unimodules/core');
  });

  // mock console.warn
  const originalWarn = console.warn;
  beforeEach(() => {
    console.warn = jest.fn();
  });
  afterEach(() => (console.warn = originalWarn));

  function mockExponentConstants(mockValues: object) {
    jest.doMock('../ExponentConstants', () => {
      const ExponentConstants = jest.requireActual('../ExponentConstants');
      return {
        ...ExponentConstants,
        ...mockValues,
      };
    });
  }

  function mockNativeModulesProxy(mockValues: object) {
    jest.doMock('@unimodules/core', () => {
      const UnimodulesCore = jest.requireActual('@unimodules/core');
      return {
        ...UnimodulesCore,
        NativeModulesProxy: {
          ...(UnimodulesCore.NativeModulesProxy ?? {}),
          ...mockValues,
        },
      };
    });
  }

  function mockExpoUpdates(mockValues: object) {
    jest.doMock('@unimodules/core', () => {
      const UnimodulesCore = jest.requireActual('@unimodules/core');
      return {
        ...UnimodulesCore,
        NativeModulesProxy: {
          ...(UnimodulesCore.NativeModulesProxy ?? {}),
          ExpoUpdates: {
            ...(UnimodulesCore.NativeModulesProxy?.ExpoUpdates ?? {}),
            ...mockValues,
          },
        },
      };
    });
  }

  it(`exists if defined as an object in ExponentConstants`, () => {
    mockExponentConstants({ manifest: fakeManifest });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`exists if defined as a string in ExponentConstants`, () => {
    mockExponentConstants({ manifest: JSON.stringify(fakeManifest) });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`exists if defined as an object by expo-updates`, () => {
    mockExponentConstants({ manifest: undefined });
    mockExpoUpdates({ manifest: fakeManifest, manifestString: undefined });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`exists if defined as a string by expo-updates`, () => {
    mockExponentConstants({ manifest: undefined });
    mockExpoUpdates({ manifest: undefined, manifestString: JSON.stringify(fakeManifest) });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`is null if undefined in ExponentConstants and expo-updates`, () => {
    mockExponentConstants({ manifest: undefined });
    mockExpoUpdates({ manifest: undefined, manifestString: undefined });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it(`is null if undefined in ExponentConstants, and expo-updates does not exist`, () => {
    mockExponentConstants({ manifest: undefined });
    mockNativeModulesProxy({ ExpoUpdates: undefined });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toBeNull();
    expect(console.warn).toHaveBeenCalled();
  });

  it(`is overridden by expo-updates if both are defined`, () => {
    mockExponentConstants({ manifest: fakeManifest });
    mockExpoUpdates({ manifest: fakeManifest2 });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest2);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it(`is not overridden if expo-updates exports an empty manifest`, () => {
    mockExponentConstants({ manifest: fakeManifest });
    mockExpoUpdates({ manifest: {} });
    const ConstantsWithMock = require('../Constants').default;
    expect(ConstantsWithMock.manifest).toEqual(fakeManifest);
    expect(console.warn).not.toHaveBeenCalled();
  });

  [ExecutionEnvironment.Standalone, ExecutionEnvironment.StoreClient].forEach(env => {
    it(`throws an error if manifest is falsey when Constants.executionEnvironment is ${env}`, () => {
      mockExponentConstants({
        manifest: null,
        executionEnvironment: env,
      });
      const ConstantsWithMock = require('../Constants').default;
      expect(ConstantsWithMock).toThrowErrorMatchingSnapshot();
    });
  });
});
