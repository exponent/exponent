import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  withAppBuildGradle,
} from '@expo/config-plugins';

const pkg = require('expo-app-auth/package.json');

// The placeholder scheme doesn't really matter, but sometimes the Android build fails without it being defined.
export function setGradlePlaceholders(buildGradle: string, placeholder: string): string {
  const pattern = /appAuthRedirectScheme:\s?(["'])(?:(?=(\\?))\2.)*?\1/g;
  const replacement = `appAuthRedirectScheme: '${placeholder}'`;
  if (buildGradle.match(pattern)) {
    // Select kotlinVersion = '***' and replace the contents between the quotes.
    return buildGradle.replace(pattern, replacement);
  }

  // There's a chance this could fail if another plugin defines `manifestPlaceholders`
  // but AFAIK only app-auth does this in the Expo ecosystem.
  return buildGradle.replace(
    /defaultConfig\s?{/,
    `defaultConfig {
        manifestPlaceholders = [${replacement}]`
  );
}

const withAppAuth: ConfigPlugin<{ placeholder?: string } | void> = (
  config,
  { placeholder = AndroidConfig.Scheme.getScheme(config)[0] || 'dev.expo.app' } = {}
) => {
  return withAppBuildGradle(config, config => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = setGradlePlaceholders(config.modResults.contents, placeholder);
    } else {
      throw new Error(
        "Cannot set manifest placeholders' appAuthRedirectScheme in the app gradle because the build.gradle is not groovy"
      );
    }
    return config;
  });
};

export default createRunOncePlugin(withAppAuth, pkg.name, pkg.version);
