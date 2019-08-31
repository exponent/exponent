import { UnavailabilityError } from '@unimodules/core';
import invariant from 'invariant';
import { Platform } from 'react-native';

import ExpoLocalAuthentication from './ExpoLocalAuthentication';
import {
  AuthOptions,
  AuthenticationType,
  LocalAuthenticationResult,
} from './LocalAuthentication.types';

export { AuthenticationType, LocalAuthenticationResult };

export async function hasHardwareAsync(): Promise<boolean> {
  if (!ExpoLocalAuthentication.hasHardwareAsync) {
    throw new UnavailabilityError('expo-local-authentication', 'hasHardwareAsync');
  }
  return await ExpoLocalAuthentication.hasHardwareAsync();
}

export async function supportedAuthenticationTypesAsync(): Promise<AuthenticationType[]> {
  if (!ExpoLocalAuthentication.supportedAuthenticationTypesAsync) {
    throw new UnavailabilityError('expo-local-authentication', 'supportedAuthenticationTypesAsync');
  }
  return await ExpoLocalAuthentication.supportedAuthenticationTypesAsync();
}

export async function isEnrolledAsync(): Promise<boolean> {
  if (!ExpoLocalAuthentication.isEnrolledAsync) {
    throw new UnavailabilityError('expo-local-authentication', 'isEnrolledAsync');
  }
  return await ExpoLocalAuthentication.isEnrolledAsync();
}

export async function authenticateAsync(
  options: AuthOptions = { promptMessage: 'Authenticate' }
): Promise<LocalAuthenticationResult> {
  if (!ExpoLocalAuthentication.authenticateAsync) {
    throw new UnavailabilityError('expo-local-authentication', 'authenticateAsync');
  }

  // Warn if using an old API - to be removed in SDK35.
  if (typeof options === 'string') {
    console.warn(
      'String argument in LocalAuthentication.authenticateAsync has been deprecated. Please use options object with `promptMessage` key instead.'
    );
    options = { promptMessage: options };
  }

  if (Platform.OS === 'ios') {
    invariant(
      typeof options.promptMessage === 'string' && options.promptMessage.length,
      'LocalAuthentication.authenticateAsync must be called with a non-empty `options.promptMessage` string on iOS'
    );

    const result = await ExpoLocalAuthentication.authenticateAsync(options);

    if (result.warning) {
      console.warn(result.warning);
    }
    return result;
  } else {
    return await ExpoLocalAuthentication.authenticateAsync();
  }
}

export async function cancelAuthenticate(): Promise<void> {
  if (!ExpoLocalAuthentication.cancelAuthenticate) {
    throw new UnavailabilityError('expo-local-authentication', 'cancelAuthenticate');
  }
  await ExpoLocalAuthentication.cancelAuthenticate();
}
