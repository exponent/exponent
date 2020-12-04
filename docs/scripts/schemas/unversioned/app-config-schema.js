export default {
  name: {
    description:
      'The name of your app as it appears both within Expo client and on your home screen as a standalone app.',
    type: 'string',
    meta: {
      bareWorkflow:
        "To change the name of your app, edit the 'Display Name' field in Xcode and the `app_name` string in `android/app/src/main/res/values/strings.xml`",
    },
  },
  description: {
    description: 'A short description of what your app is and why it is great.',
    type: 'string',
  },
  slug: {
    description:
      'The friendly URL name for publishing. For example, `myAppName` will refer to the `expo.io/@project-owner/myAppName` project.',
    type: 'string',
    pattern: '^[a-zA-Z0-9_\\-]+$',
  },
  owner: {
    description:
      'The Expo account name of the team owner, only applicable if you are enrolled in Expo Developer Services. If not provided, defaults to the username of the current user.',
    type: 'string',
    minLength: 1,
  },
  privacy: {
    description:
      'Defaults to `unlisted`. `unlisted` hides the project from search results. `hidden` restricts access to the project page to only the owner and other users that have been granted access. Valid values: `public`, `unlisted`, `hidden`.',
    enum: ['public', 'unlisted', 'hidden'],
    type: 'string',
    fallback: 'unlisted',
  },
  sdkVersion: {
    description:
      'The Expo sdkVersion to run the project on. This should line up with the version specified in your package.json.',
    type: 'string',
    pattern: '^(\\d+\\.\\d+\\.\\d+)|(UNVERSIONED)$',
  },
  runtimeVersion: {
    description:
      "**Note: Don't use this property unless you are sure what you're doing** \n\nThe runtime version associated with this manifest for bare workflow projects. If provided, this must match the version set in Expo.plist or AndroidManifest.xml.",
    type: 'string',
    pattern: '^[0-9\\.]+$',
  },
  version: {
    description:
      "Your app version. In addition to this field, you'll also use `ios.buildNumber` and `android.versionCode` — read more about how to version your app [here](../../distribution/app-stores/#versioning-your-app). On iOS this corresponds to `CFBundleShortVersionString`, and on Android, this corresponds to `versionName`. The required format can be found [here](https://developer.apple.com/documentation/bundleresources/information_property_list/cfbundleshortversionstring).",
    type: 'string',
    meta: {
      bareWorkflow:
        "To change your app version, edit the 'Version' field in Xcode and the `versionName` string in `android/app/build.gradle`",
    },
  },
  platforms: {
    description:
      'Platforms that your project explicitly supports. If not specified, it defaults to `["ios", "android"]`.',
    example: ['ios', 'android', 'web'],
    type: 'array',
    uniqueItems: true,
    items: { type: 'string', enum: ['android', 'ios', 'web'] },
  },
  githubUrl: {
    description:
      'If you would like to share the source code of your app on Github, enter the URL for the repository here and it will be linked to from your Expo project page.',
    pattern: '^https://github\\.com/',
    example: 'https://github.com/expo/expo',
    type: ['string'],
  },
  orientation: {
    description:
      'Locks your app to a specific orientation with portrait or landscape. Defaults to no lock. Valid values: `default`, `portrait`, `landscape`',
    enum: ['default', 'portrait', 'landscape'],
    type: 'string',
  },
  userInterfaceStyle: {
    description:
      'Configuration to force the app to always use the light or dark user-interface appearance, such as "dark mode", or make it automatically adapt to the system preferences. If not provided, defaults to `light`.',
    type: 'string',
    fallback: 'light',
    enum: ['light', 'dark', 'automatic'],
  },
  backgroundColor: {
    description:
      'The background color for your app, behind any of your React views. This is also known as the root view background color.',
    type: 'string',
    pattern: '^#|(&#x23;)\\d{6}$',
    meta: {
      regexHuman:
        "6 character long hex color string, for example, `'#000000'`. Default is white: `'#ffffff'`",
    },
  },
  primaryColor: {
    description:
      'On Android, this will determine the color of your app in the multitasker. Currently this is not used on iOS, but it may be used for other purposes in the future.',
    type: 'string',
    pattern: '^#|(&#x23;)\\d{6}$',
    meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
  },
  icon: {
    description:
      "Local path or remote URL to an image to use for your app's icon. We recommend that you use a 1024x1024 png file. This icon will appear on the home screen and within the Expo app.",
    type: 'string',
    meta: {
      asset: true,
      contentTypePattern: '^image/png$',
      contentTypeHuman: '.png image',
      square: true,
      bareWorkflow:
        "To change your app's icon, edit or replace the files in `ios/<PROJECT-NAME>/Assets.xcassets/AppIcon.appiconset` (we recommend using Xcode), and `android/app/src/main/res/mipmap-<RESOLUTION>`. Be sure to follow the guidelines for each platform ([iOS](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/), [Android 7.1 and below](https://material.io/design/iconography/#icon-treatments), and [Android 8+](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)) and to provide your new icon in each existing size.",
    },
  },
  notification: {
    description: 'Configuration for remote (push) notifications.',
    type: 'object',
    properties: {
      icon: {
        description:
          'Local path or remote URL to an image to use as the icon for push notifications. 96x96 png grayscale with transparency.',
        type: 'string',
        meta: {
          asset: true,
          contentTypePattern: '^image/png$',
          contentTypeHuman: '.png image',
          square: true,
        },
      },
      color: {
        description:
          'Tint color for the push notification image when it appears in the notification tray.',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
      },
      iosDisplayInForeground: {
        description:
          'Whether or not to display notifications when the app is in the foreground on iOS. `_displayInForeground` option in the individual push notification message overrides this option. [Learn more.](https://docs.expo.io/guides/push-notifications/#3-handle-receiving-andor-selecting-the-notification) Defaults to `false`.',
        type: 'boolean',
      },
      androidMode: {
        description:
          'Show each push notification individually (`default`) or collapse into one (`collapse`).',
        enum: ['default', 'collapse'],
        type: 'string',
      },
      androidCollapsedTitle: {
        description:
          "If `androidMode` is set to `collapse`, this title is used for the collapsed notification message. For example, `'#{unread_notifications} new interactions'`.",
        type: 'string',
      },
    },
    additionalProperties: false,
  },
  loading: {
    description:
      '@deprecated Use `splash` instead. Configuration for the loading screen that users see when opening your app, while fetching & caching bundle and assets.',
    type: 'object',
    properties: {
      icon: {
        description:
          'Local path or remote URL to an image to display while starting up the app. Image size and aspect ratio are up to you. Must be a .png.',
        type: 'string',
        meta: { asset: true, contentTypePattern: '^image/png$', contentTypeHuman: '.png image' },
      },
      exponentIconColor: {
        description:
          'If no icon is provided, we will show the Expo logo. You can choose between `white` and `blue`.',
        enum: ['white', 'blue'],
        type: 'string',
      },
      exponentIconGrayscale: {
        description:
          'Similar to `exponentIconColor` but instead indicate if it should be grayscale (`1`) or not (`0`).',
        type: 'number',
        minimum: 0,
        maximum: 1,
      },
      backgroundImage: {
        description:
          'Local path or remote URL to an image to fill the background of the loading screen. Image size and aspect ratio are up to you. Must be a .png.',
        type: 'string',
        meta: { asset: true, contentTypePattern: '^image/png$', contentTypeHuman: '.png image' },
      },
      backgroundColor: {
        description: 'Color to fill the loading screen background',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
      },
      hideExponentText: {
        description:
          'By default, Expo shows some text at the bottom of the loading screen. Set this to `true` to disable.',
        type: 'boolean',
      },
      loadingIndicatorStyleExperimental: {
        description:
          '@deprecated Previously used for changing the style of the iOS loading indicator.',
        type: 'string',
        pattern: '^light$',
        meta: { autogenerated: true },
      },
    },
    meta: { deprecated: true },
    additionalProperties: false,
  },
  appKey: {
    description:
      'By default, Expo looks for the application registered with the AppRegistry as `main`. If you would like to change this, you can specify the name in this property.',
    type: 'string',
  },
  androidStatusBarColor: {
    description: '@deprecated Use `androidStatusBar` instead.',
    type: 'string',
    pattern: '^#|(&#x23;)\\d{6}$',
    meta: {
      deprecated: true,
      regexHuman: "6 character long hex color string, for example, `'#000000'`",
    },
  },
  androidStatusBar: {
    description:
      'Configuration for the status bar on Android. For more details please navigate to [Configuring StatusBar](../../guides/configuring-statusbar).',
    type: 'object',
    properties: {
      barStyle: {
        description:
          'Configures the status bar icons to have a light or dark color. Valid values: `light-content`, `dark-content`. Defaults to `dark-content`',
        type: 'string',
        enum: ['light-content', 'dark-content'],
      },
      backgroundColor: {
        description:
          'Specifies the background color of the status bar. Defaults to `#00000000` (transparent) for `dark-content` bar style and `#00000088` (semi-transparent black) for `light-content` bar style',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: {
          regexHuman:
            "6 character long hex color string `'#RRGGBBAA'`, for example, `'#000000'` for black. Or 8 character long hex color string `'#RRGGBBAA'`, for example, `'#00000088'` for semi-transparent black.",
        },
      },
      hidden: {
        description:
          'Instructs the system whether the status bar should be visible or not. Defaults to `false`',
        type: 'boolean',
      },
      translucent: {
        description:
          "Specifies whether the status bar should be translucent (whether it should be treated as a block element that will take up space on the device's screen and limit space available for the rest of your app to be rendered, or be treated as an element with `'position = absolute'` that is rendered above your app's content). Defaults to `true` (default iOS behavior, the iOS status bar cannot be set translucent by the system)",
        type: 'boolean',
      },
    },
    additionalProperties: false,
  },
  androidNavigationBar: {
    description: 'Configuration for the bottom navigation bar on Android.',
    type: 'object',
    properties: {
      visible: {
        description:
          "Determines how and when the navigation bar is shown. [Learn more](https://developer.android.com/training/system-ui/immersive). Valid values: `leanback`, `immersive`, `sticky-immersive` \n\n `leanback` results in the navigation bar being hidden until the first touch gesture is registered. \n\n `immersive` results in the navigation bar being hidden until the user swipes up from the edge where the navigation bar is hidden. \n\n `sticky-immersive` is identical to `'immersive'` except that the navigation bar will be semi-transparent and will be hidden again after a short period of time",
        type: 'string',
        enum: ['leanback', 'immersive', 'sticky-immersive'],
      },
      barStyle: {
        description:
          "Configure the navigation bar icons to have a light or dark color. Supported on Android Oreo and newer. Valid values: `'light-content'`, `'dark-content'`",
        type: 'string',
        enum: ['light-content', 'dark-content'],
      },
      backgroundColor: {
        description: 'Specifies the background color of the navigation bar.',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
      },
    },
    additionalProperties: false,
  },
  androidShowExponentNotificationInShellApp: {
    description: 'Adds a notification to your standalone app with refresh button and debug info.',
    type: 'boolean',
  },
  developmentClient: {
    description: 'Settings that apply specifically to running this app in a development client',
    type: 'object',
    properties: {
      silentLaunch: {
        description:
          'If true, the app will launch in a development client with no additional dialogs or progress indicators, just like in a standalone app.',
        type: 'boolean',
        fallback: false,
      },
    },
    additionalProperties: false,
  },
  scheme: {
    description:
      "**Standalone Apps Only**. URL scheme to link into your app. For example, if we set this to `'demo'`, then demo:// URLs would open your app when tapped.",
    type: 'string',
    pattern: '^[a-z][a-z0-9+.-]*$',
    meta: {
      regexHuman:
        'String beginning with a **lowercase** letter followed by any combination of **lowercase** letters, digits, "+", "." or "-"',
      standaloneOnly: true,
      bareWorkflow:
        "To change your app's scheme, replace all occurrences of the old scheme in `Info.plist` and `AndroidManifest.xml`",
    },
  },
  entryPoint: { description: 'The relative path to your main JavaScript file.', type: 'string' },
  extra: {
    description:
      'Any extra fields you want to pass to your experience. Values are accessible via `Expo.Constants.manifest.extra` ([Learn more](../sdk/constants.html#expoconstantsmanifest))',
    type: 'object',
    properties: {},
    additionalProperties: true,
  },
  rnCliPath: { type: 'string' },
  packagerOpts: { type: 'object', properties: {}, additionalProperties: true },
  ignoreNodeModulesValidation: { type: 'boolean' },
  nodeModulesPath: { type: 'string' },
  updates: {
    description: 'Configuration for how and when the app should request OTA JavaScript updates',
    type: 'object',
    properties: {
      enabled: {
        description:
          'If set to false, your standalone app will never download any code, and will only use code bundled locally on the device. In that case, all updates to your app must be submitted through Apple review. Defaults to true. (Note: This will not work out of the box with ExpoKit projects)',
        type: 'boolean',
      },
      checkAutomatically: {
        description:
          'By default, Expo will check for updates every time the app is loaded. Set this to `ON_ERROR_RECOVERY` to disable automatic checking unless recovering from an error. Must be one of `ON_LOAD` or `ON_ERROR_RECOVERY`',
        enum: ['ON_ERROR_RECOVERY', 'ON_LOAD'],
        type: 'string',
      },
      fallbackToCacheTimeout: {
        description:
          'How long (in ms) to allow for fetching OTA updates before falling back to a cached version of the app. Defaults to 30000 (30 sec). Must be between 0 and 300000 (5 minutes).',
        type: 'number',
        minimum: 0,
        maximum: 300000,
      },
    },
    additionalProperties: false,
  },
  locales: {
    description: 'Provide overrides by locale for System Dialog prompts like Permissions Boxes',
    type: 'object',
    properties: {},
    meta: {
      bareWorkflow:
        'To add or change language and localization information in your iOS app, you need to use Xcode.',
    },
    additionalProperties: { type: ['string'] },
  },
  ios: {
    description: 'Configuration that is specific to the iOS platform.',
    type: 'object',
    meta: { standaloneOnly: true },
    properties: {
      publishManifestPath: {
        description:
          'The manifest for the iOS version of your app will be written to this path during publish.',
        type: 'string',
        meta: { autogenerated: true },
      },
      publishBundlePath: {
        description:
          'The bundle for the iOS version of your app will be written to this path during publish.',
        type: 'string',
        meta: { autogenerated: true },
      },
      bundleIdentifier: {
        description:
          'The bundle identifier for your iOS standalone app. You make it up, but it needs to be unique on the App Store. See [this StackOverflow question](http://stackoverflow.com/questions/11347470/what-does-bundle-identifier-mean-in-the-ios-project).',
        type: 'string',
        pattern: '^[a-zA-Z][a-zA-Z0-9\\-\\.]+$',
        meta: {
          bareWorkflow: 'Set this value in `info.plist` under `CFBundleIdentifier`',
          regexHuman:
            'iOS bundle identifier notation unique name for your app. For example, `host.exp.expo`, where `exp.host` is our domain and `expo` is our app name.',
        },
      },
      buildNumber: {
        description:
          "Build number for your iOS standalone app. Corresponds to `CFBundleVersion` and must match Apple's [specified format](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CoreFoundationKeys.html#//apple_ref/doc/uid/20001431-102364). (Note: Transporter will pull the value for `Version Number` from `expo.version` and NOT from `expo.ios.buildNumber`.)",
        type: 'string',
        pattern: '^[A-Za-z0-9\\.]+$',
        meta: { bareWorkflow: 'Set this value in `info.plist` under `CFBundleIdentifier`' },
      },
      backgroundColor: {
        description:
          'The background color for your iOS app, behind any of your React views. Overrides the top-level `backgroundColor` key if it is present.',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
      },
      icon: {
        description:
          "Local path or remote URL to an image to use for your app's icon on iOS. If specified, this overrides the top-level `icon` key. Use a 1024x1024 icon which follows Apple's interface guidelines for icons, including color profile and transparency. \n\n Expo will generate the other required sizes. This icon will appear on the home screen and within the Expo app.",
        type: 'string',
        meta: {
          asset: true,
          contentTypePattern: '^image/png$',
          contentTypeHuman: '.png image',
          square: true,
        },
      },
      merchantId: {
        description: 'Merchant ID for use with Apple Pay in your standalone app.',
        type: 'string',
      },
      appStoreUrl: {
        description:
          'URL to your app on the Apple App Store, if you have deployed it there. This is used to link to your store page from your Expo project page if your app is public.',
        pattern: '^https://(itunes|apps)\\.apple\\.com/.*?\\d+',
        example: 'https://apps.apple.com/us/app/expo-client/id982107779',
        type: ['string'],
      },
      config: {
        type: 'object',
        description:
          'Note: This property key is not included in the production manifest and will evaluate to `undefined`. It is used internally only in the build process, because it contains API keys that some may want to keep private.',
        properties: {
          branch: {
            description: '[Branch](https://branch.io/) key to hook up Branch linking services.',
            type: 'object',
            properties: { apiKey: { description: 'Your Branch API key', type: 'string' } },
            additionalProperties: false,
          },
          usesNonExemptEncryption: {
            description:
              "Sets `ITSAppUsesNonExemptEncryption` in the standalone ipa's Info.plist to the given boolean value.",
            type: 'boolean',
          },
          googleMapsApiKey: {
            description:
              '[Google Maps iOS SDK](https://developers.google.com/maps/documentation/ios-sdk/start) key for your standalone app.',
            type: 'string',
          },
          googleMobileAdsAppId: {
            description:
              '[Google Mobile Ads App ID](https://support.google.com/admob/answer/6232340) Google AdMob App ID. ',
            type: 'string',
          },
          googleMobileAdsAutoInit: {
            description:
              'A boolean indicating whether to initialize Google App Measurement and begin sending user-level event data to Google immediately when the app starts. The default in Expo (Client and in standalone apps) is `false`. [Sets the opposite of the given value to the following key in `Info.plist`.](https://developers.google.com/admob/ios/eu-consent#delay_app_measurement_optional)',
            type: 'boolean',
            fallback: false,
          },
          googleSignIn: {
            description:
              '[Google Sign-In iOS SDK](https://developers.google.com/identity/sign-in/ios/start-integrating) keys for your standalone app.',
            type: 'object',
            properties: {
              reservedClientId: {
                description:
                  'The reserved client ID URL scheme. Can be found in `GoogleService-Info.plist`.',
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
      isRemoteJSEnabled: {
        description: '@deprecated Use `updates.enabled` instead.',
        type: 'boolean',
        meta: { deprecated: true },
      },
      googleServicesFile: {
        description:
          '[Firebase Configuration File](https://support.google.com/firebase/answer/7015592) Location of the `GoogleService-Info.plist` file for configuring Firebase.',
        type: 'string',
      },
      loadJSInBackgroundExperimental: {
        description: '@deprecated Use `updates` key with `fallbackToCacheTimeout: 0` instead.',
        type: 'boolean',
        meta: { deprecated: true },
      },
      supportsTablet: {
        description:
          'Whether your standalone iOS app supports tablet screen sizes. Defaults to `false`.',
        type: 'boolean',
        meta: {
          bareWorkflow:
            'Set this value in `info.plist` under `UISupportedInterfaceOrientations~ipad`',
        },
      },
      isTabletOnly: {
        description:
          'If true, indicates that your standalone iOS app does not support handsets, and only supports tablets.',
        type: 'boolean',
        meta: {
          bareWorkflow: 'Set this value in `info.plist` under `UISupportedInterfaceOrientations`',
        },
      },
      requireFullScreen: {
        description:
          'If true, indicates that your standalone iOS app does not support Slide Over and Split View on iPad. Defaults to `true` currently, but will change to `false` in a future SDK version.',
        type: 'boolean',
        meta: { bareWorkflow: 'Use Xcode to set `UIRequiresFullScreen`' },
      },
      userInterfaceStyle: {
        description:
          'Configuration to force the app to always use the light or dark user-interface appearance, such as "dark mode", or make it automatically adapt to the system preferences. If not provided, defaults to `light`.',
        type: 'string',
        fallback: 'light',
        enum: ['light', 'dark', 'automatic'],
      },
      infoPlist: {
        description:
          "Dictionary of arbitrary configuration to add to your standalone app's native Info.plist. Applied prior to all other Expo-specific configuration. No other validation is performed, so use this at your own risk of rejection from the App Store.",
        type: 'object',
        properties: {},
        additionalProperties: true,
      },
      associatedDomains: {
        description:
          "An array that contains Associated Domains for the standalone app. See [Apple's docs for config](https://developer.apple.com/documentation/uikit/core_app/allowing_apps_and_websites_to_link_to_your_content/enabling_universal_links). ",
        type: 'array',
        uniqueItems: true,
        items: { type: 'string' },
        meta: {
          regexHuman:
            "Entries must follow the format `applinks:<fully qualified domain>[:port number]`. See [Apple's docs for details](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_associated-domains)",
          bareWorkflow:
            "Use Xcode to set this. See [Apple's documentation](https://developer.apple.com/documentation/uikit/inter-process_communication/allowing_apps_and_websites_to_link_to_your_content/enabling_universal_links) for details.",
        },
      },
      usesIcloudStorage: {
        description:
          'A boolean indicating if the app uses iCloud Storage for `DocumentPicker`. See `DocumentPicker` docs for details.',
        type: 'boolean',
        meta: { bareWorkflow: 'Use Xcode to set this.' },
      },
      usesAppleSignIn: {
        description:
          'A boolean indicating if the app uses Apple Sign-In. See `AppleAuthentication` docs for details.',
        type: 'boolean',
        fallback: false,
      },
      accessesContactNotes: {
        description:
          'A Boolean value that indicates whether the app may access the notes stored in contacts. You must [receive permission from Apple](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_contacts_notes) before you can submit your app for review with this capability.',
        type: 'boolean',
        fallback: false,
      },
      splash: {
        description: 'Configuration for loading and splash screen for standalone iOS apps.',
        type: 'object',
        properties: {
          xib: {
            description:
              'Local path to a XIB file as the loading screen. It overrides other loading screen options. Note: This will only be used in the standalone app (i.e., after you build the app). It will not be used in the Expo client.',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^text/xml$',
              contentTypeHuman: '.xib interface builder document',
            },
          },
          backgroundColor: {
            description: 'Color to fill the loading screen background',
            type: 'string',
            pattern: '^#|(&#x23;)\\d{6}$',
            meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
          },
          resizeMode: {
            description:
              'Determines how the `image` will be displayed in the splash loading screen. Must be one of `cover` or `contain`, defaults to `contain`.',
            enum: ['cover', 'contain'],
            type: 'string',
          },
          image: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen. Image size and aspect ratio are up to you. Must be a .png.',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          tabletImage: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen. Image size and aspect ratio are up to you. Must be a .png.',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          userInterfaceStyle: {
            description:
              'Supported user interface styles. If left blank, `light` will be used. Use `automatic` if you would like to support either `light` or `dark` depending on iOS settings.',
            type: 'string',
            fallback: 'light',
            enum: ['light', 'dark', 'automatic'],
          },
        },
      },
    },
    additionalProperties: false,
  },
  android: {
    description: 'Configuration that is specific to the Android platform.',
    type: 'object',
    meta: { standaloneOnly: true },
    properties: {
      enableDangerousExperimentalLeanBuilds: {
        description:
          'If set to true, APK will contain only unimodules that are explicitly added in package.json and their dependecies',
        type: 'boolean',
      },
      publishManifestPath: {
        description:
          'The manifest for the Android version of your app will be written to this path during publish.',
        type: 'string',
        meta: { autogenerated: true },
      },
      publishBundlePath: {
        description:
          'The bundle for the Android version of your app will be written to this path during publish.',
        type: 'string',
        meta: { autogenerated: true },
      },
      package: {
        description:
          'The package name for your Android standalone app. You make it up, but it needs to be unique on the Play Store. See [this StackOverflow question](http://stackoverflow.com/questions/6273892/android-package-name-convention).',
        type: 'string',
        pattern: '^[a-zA-Z][a-zA-Z0-9\\_]*(\\.[a-zA-Z][a-zA-Z0-9\\_]*)+$',
        meta: {
          regexHuman:
            'Reverse DNS notation unique name for your app. Valid Android Application ID. For example, `com.example.App`, where `com.example` is our domain and `App` is our app. The name may only contain lowercase and uppercase letters (a-z, A-Z), numbers (0-9) and underscores (_), separated by periods (.). Each component of the name should start with a lowercase letter.',
          bareWorkflow:
            'This is set in `android/app/build.gradle` as `applicationId` as well as in your `AndroidManifest.xml` file (multiple places).',
        },
      },
      versionCode: {
        description:
          'Version number required by Google Play. Increment by one for each release. Must be an integer. [Learn more](https://developer.android.com/studio/publish/versioning.html)',
        type: 'integer',
        meta: { bareWorkflow: 'This is set in `android/app/build.gradle` as `versionCode`' },
      },
      backgroundColor: {
        description:
          'The background color for your Android app, behind any of your React views. Overrides the top-level `backgroundColor` key if it is present.',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: {
          regexHuman: "6 character long hex color string, for example, `'#000000'`",
          bareWorkflow:
            'This is set in `android/app/src/main/AndroidManifest.xml` under `android:windowBackground`',
        },
      },
      userInterfaceStyle: {
        description:
          'Configuration to force the app to always use the light or dark user-interface appearance, such as "dark mode", or make it automatically adapt to the system preferences. If not provided, defaults to `light`.',
        type: 'string',
        fallback: 'light',
        enum: ['light', 'dark', 'automatic'],
      },
      useNextNotificationsApi: {
        description:
          'A Boolean value that indicates whether the app should use the new notifications API.',
        type: 'boolean',
        fallback: false,
      },
      icon: {
        description:
          "Local path or remote URL to an image to use for your app's icon on Android. If specified, this overrides the top-level `icon` key. We recommend that you use a 1024x1024 png file (transparency is recommended for the Google Play Store). This icon will appear on the home screen and within the Expo app.",
        type: 'string',
        meta: {
          asset: true,
          contentTypePattern: '^image/png$',
          contentTypeHuman: '.png image',
          square: true,
        },
      },
      adaptiveIcon: {
        description:
          'Settings for an Adaptive Launcher Icon on Android. [Learn more](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)',
        type: 'object',
        properties: {
          foregroundImage: {
            description:
              "Local path or remote URL to an image to use for your app's icon on Android. If specified, this overrides the top-level `icon` and the `android.icon` keys. Should follow the [specified guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive). This icon will appear on the home screen.",
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
              square: true,
            },
          },
          backgroundImage: {
            description:
              "Local path or remote URL to a background image for your app's Adaptive Icon on Android. If specified, this overrides the `backgroundColor` key. Must have the same dimensions as  foregroundImage`, and has no effect if `foregroundImage` is not specified. Should follow the [specified guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive).",
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
              square: true,
            },
          },
          backgroundColor: {
            description:
              "Color to use as the background for your app's Adaptive Icon on Android. Defaults to white, `#FFFFFF`. Has no effect if `foregroundImage` is not specified.",
            type: 'string',
            pattern: '^#|(&#x23;)\\d{6}$',
            meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
          },
        },
        additionalProperties: false,
      },
      playStoreUrl: {
        description:
          'URL to your app on the Google Play Store, if you have deployed it there. This is used to link to your store page from your Expo project page if your app is public.',
        pattern: '^https://play\\.google\\.com/',
        example: 'https://play.google.com/store/apps/details?id=host.exp.exponent',
        type: ['string'],
      },
      permissions: {
        description:
          'List of permissions used by the standalone app. \n\n To use ONLY the following minimum necessary permissions and none of the extras supported by Expo in a default managed app, set `permissions` to `[]`. The minimum necessary permissions do not require a Privacy Policy when uploading to Google Play Store and are: \n• receive data from Internet \n• view network connections \n• full network access \n• change your audio settings \n• prevent device from sleeping \n\n To use ALL permissions supported by Expo by default, do not specify the `permissions` key. \n\n  To use the minimum necessary permissions ALONG with certain additional permissions, specify those extras in `permissions`, e.g.\n\n `[ "CAMERA", "ACCESS_FINE_LOCATION" ]`.\n\n  You can specify the following permissions depending on what you need:\n\n- `ACCESS_COARSE_LOCATION`\n- `ACCESS_FINE_LOCATION`\n- `ACCESS_BACKGROUND_LOCATION`\n- `CAMERA`\n- `RECORD_AUDIO`\n- `READ_CONTACTS`\n- `WRITE_CONTACTS`\n- `READ_CALENDAR`\n- `WRITE_CALENDAR`\n- `READ_EXTERNAL_STORAGE`\n- `WRITE_EXTERNAL_STORAGE`\n- `USE_FINGERPRINT`\n- `USE_BIOMETRIC`\n- `WRITE_SETTINGS`\n- `VIBRATE`\n- `READ_PHONE_STATE`\n- `com.anddoes.launcher.permission.UPDATE_COUNT`\n- `com.android.launcher.permission.INSTALL_SHORTCUT`\n- `com.google.android.c2dm.permission.RECEIVE`\n- `com.google.android.gms.permission.ACTIVITY_RECOGNITION`\n- `com.google.android.providers.gsf.permission.READ_GSERVICES`\n- `com.htc.launcher.permission.READ_SETTINGS`\n- `com.htc.launcher.permission.UPDATE_SHORTCUT`\n- `com.majeur.launcher.permission.UPDATE_BADGE`\n- `com.sec.android.provider.badge.permission.READ`\n- `com.sec.android.provider.badge.permission.WRITE`\n- `com.sonyericsson.home.permission.BROADCAST_BADGE`\n',
        type: 'array',
        bareWorkflow:
          'To change the permissions your app requests, you\'ll need to edit `AndroidManifest.xml` manually. To prevent your app from requesting one of the permissions listed below, you\'ll need to explicitly add it to `AndroidManifest.xml` along with a `tools:node="remove"` tag.',
        items: { type: 'string' },
      },
      googleServicesFile: {
        description:
          '[Firebase Configuration File](https://support.google.com/firebase/answer/7015592) Location of the `GoogleService-Info.plist` file for configuring Firebase. Including this key automatically enables FCM in your standalone app.',
        type: 'string',
        bareWorkflow: 'Add or edit the file directly at `android/app/google-services.json`',
      },
      config: {
        type: 'object',
        description:
          'Note: This property key is not included in the production manifest and will evaluate to `undefined`. It is used internally only in the build process, because it contains API keys that some may want to keep private.',
        properties: {
          branch: {
            description: '[Branch](https://branch.io/) key to hook up Branch linking services.',
            type: 'object',
            properties: { apiKey: { description: 'Your Branch API key', type: 'string' } },
            additionalProperties: false,
          },
          googleMaps: {
            description:
              '[Google Maps Android SDK](https://developers.google.com/maps/documentation/android-api/signup) configuration for your standalone app.',
            type: 'object',
            properties: {
              apiKey: { description: 'Your Google Maps Android SDK API key', type: 'string' },
            },
            additionalProperties: false,
          },
          googleMobileAdsAppId: {
            description:
              '[Google Mobile Ads App ID](https://support.google.com/admob/answer/6232340) Google AdMob App ID. ',
            type: 'string',
          },
          googleMobileAdsAutoInit: {
            description:
              'A boolean indicating whether to initialize Google App Measurement and begin sending user-level event data to Google immediately when the app starts. The default in Expo (Client and in standalone apps) is `false`. [Sets the opposite of the given value to the following key in `Info.plist`](https://developers.google.com/admob/ios/eu-consent#delay_app_measurement_optional)',
            type: 'boolean',
            fallback: false,
          },
          googleSignIn: {
            deprecated: true,
            meta: { deprecated: true },
            description:
              '@deprecated Use `googleServicesFile` instead. [Google Sign-In Android SDK](https://developers.google.com/identity/sign-in/android/start-integrating) keys for your standalone app.',
            type: 'object',
            properties: {
              apiKey: {
                description:
                  'The Android API key. Can be found in the credentials section of the developer console or in `google-services.json`.',
                type: 'string',
              },
              certificateHash: {
                description:
                  'The SHA-1 hash of the signing certificate used to build the APK without any separator (`:`). Can be found in `google-services.json`. https://developers.google.com/android/guides/client-auth',
                type: 'string',
              },
            },
            additionalProperties: false,
          },
        },
        additionalProperties: false,
      },
      splash: {
        description: 'Configuration for loading and splash screen for standalone Android apps.',
        type: 'object',
        properties: {
          backgroundColor: {
            description: 'Color to fill the loading screen background',
            type: 'string',
            pattern: '^#|(&#x23;)\\d{6}$',
            meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
          },
          resizeMode: {
            description:
              'Determines how the `image` will be displayed in the splash loading screen. Must be one of `cover`, `contain` or `native`, defaults to `contain`.',
            enum: ['cover', 'contain', 'native'],
            type: 'string',
          },
          mdpi: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen in "cover" mode. Image size and aspect ratio are up to you. [Learn more]( https://developer.android.com/training/multiscreen/screendensities) \n\n `Natural sized image (baseline)`',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          hdpi: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen in "cover" mode. Image size and aspect ratio are up to you. [Learn more]( https://developer.android.com/training/multiscreen/screendensities) \n\n `Scale 1.5x`',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          xhdpi: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen in "cover" mode. Image size and aspect ratio are up to you. [Learn more]( https://developer.android.com/training/multiscreen/screendensities) \n\n `Scale 2x`',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          xxhdpi: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen in "cover" mode. Image size and aspect ratio are up to you. [Learn more]( https://developer.android.com/training/multiscreen/screendensities) \n\n `Scale 3x`',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
          xxxhdpi: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen in "cover" mode. Image size and aspect ratio are up to you. [Learn more]( https://developer.android.com/training/multiscreen/screendensities) \n\n `Scale 4x`',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
        },
      },
      intentFilters: {
        description:
          'Configuration for setting an array of custom intent filters in Android manifest. [Learn more](https://developer.android.com/guide/components/intents-filters)',
        example: [
          {
            autoVerify: true,
            action: 'VIEW',
            data: { scheme: 'https', host: '*.expo.io' },
            category: ['BROWSABLE', 'DEFAULT'],
          },
        ],
        exampleString:
          '\n [{ \n "autoVerify": true, \n "action": "VIEW", \n "data": { \n "scheme": "https", \n "host": "*.expo.io" \n }, \n "category": ["BROWSABLE", "DEFAULT"] \n }]',
        type: 'array',
        uniqueItems: true,
        items: {
          type: 'object',
          properties: {
            autoVerify: {
              description:
                'You may also use an intent filter to set your app as the default handler for links (without showing the user a dialog with options). To do so use `true` and then configure your server to serve a JSON file verifying that you own the domain. [Learn more](developer.android.com/training/app-links)',
              type: 'boolean',
            },
            action: { type: 'string' },
            data: {
              type: ['array', 'object'],
              items: {
                type: 'object',
                properties: {
                  scheme: { description: 'the scheme of the URL, e.g. `https`', type: 'string' },
                  host: { description: 'the host, e.g. `myapp.io`', type: 'string' },
                  port: { description: 'the port, e.g. `3000`', type: 'string' },
                  path: {
                    description:
                      'an exact path for URLs that should be matched by the filter, e.g. `/records`',
                    type: 'string',
                  },
                  pathPattern: {
                    description:
                      ' a regex for paths that should be matched by the filter, e.g. `.*`',
                    type: 'string',
                  },
                  pathPrefix: {
                    description:
                      'a prefix for paths that should be matched by the filter, e.g. `/records/` will match `/records/123`',
                    type: 'string',
                  },
                  mimeType: {
                    description: 'a mime type for URLs that should be matched by the filter',
                    type: 'string',
                  },
                },
                additionalProperties: false,
              },
              properties: {
                scheme: { type: 'string' },
                host: { type: 'string' },
                port: { type: 'string' },
                path: { type: 'string' },
                pathPattern: { type: 'string' },
                pathPrefix: { type: 'string' },
                mimeType: { type: 'string' },
              },
              additionalProperties: false,
            },
            category: { type: ['string', 'array'] },
          },
          additionalProperties: false,
          required: ['action'],
        },
        meta: {
          bareWorkflow:
            'This is set in `AndroidManifest.xml` directly. [Learn more.](developer.android.com/guide/components/intents-filters)',
        },
      },
      allowBackup: {
        description:
          "Allows your user's app data to be automatically backed up to their Google Drive. If this is set to false, no backup or restore of the application will ever be performed (this is useful if your app deals with sensitive information). Defaults to the Android default, which is `true`.",
        fallback: true,
        type: 'boolean',
      },
      softwareKeyboardLayoutMode: {
        description:
          'Determines how the software keyboard will impact the layout of your application. This maps to the `android:windowSoftInputMode` property. Defaults to `resize`. Valid values: `resize`, `pan`.',
        enum: ['resize', 'pan'],
        type: 'string',
        fallback: 'resize',
      },
    },
    additionalProperties: false,
  },
  web: {
    description: 'Configuration that is specific to the web platform.',
    type: 'object',
    additionalProperties: true,
    properties: {
      favicon: {
        description: "Relative path of an image to use for your app's favicon.",
        type: 'string',
      },
      name: {
        description: 'Defines the title of the document, defaults to the outer level name',
        type: 'string',
        meta: { pwa: 'name' },
      },
      shortName: {
        description:
          "A short version of the app's name, 12 characters or fewer. Used in app launcher and new tab pages. Maps to `short_name` in the PWA manifest.json. Defaults to the `name` property.",
        type: 'string',
        meta: { pwa: 'short_name', regexHuman: 'Maximum 12 characters long' },
      },
      lang: {
        description:
          'Specifies the primary language for the values in the name and short_name members. This value is a string containing a single language tag.',
        type: 'string',
        fallback: 'en',
        meta: { pwa: 'lang' },
      },
      scope: {
        description:
          "Defines the navigation scope of this website's context. This restricts what web pages can be viewed while the manifest is applied. If the user navigates outside the scope, it returns to a normal web page inside a browser tab/window. If the scope is a relative URL, the base URL will be the URL of the manifest.",
        type: 'string',
        meta: { pwa: 'scope' },
      },
      themeColor: {
        description:
          "Defines the color of the Android tool bar, and may be reflected in the app's preview in task switchers.",
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: {
          pwa: 'theme_color',
          html: 'theme-color',
          regexHuman: "6 character long hex color string, for example, `'#000000'`",
        },
      },
      description: {
        description: 'Provides a general description of what the pinned website does.',
        type: 'string',
        meta: { html: 'description', pwa: 'description' },
      },
      dir: {
        description:
          'Specifies the primary text direction for the name, short_name, and description members. Together with the lang member, it helps the correct display of right-to-left languages.',
        enum: ['auto', 'ltr', 'rtl'],
        type: 'string',
        meta: { pwa: 'dir' },
      },
      display: {
        description: 'Defines the developers’ preferred display mode for the website.',
        enum: ['fullscreen', 'standalone', 'minimal-ui', 'browser'],
        type: 'string',
        meta: { pwa: 'display' },
      },
      startUrl: {
        description:
          'The URL that loads when a user launches the application (e.g., when added to home screen), typically the index. Note: This has to be a relative URL, relative to the manifest URL.',
        type: 'string',
        meta: { pwa: 'start_url' },
      },
      orientation: {
        description:
          "Defines the default orientation for all the website's top level browsing contexts.",
        enum: [
          'any',
          'natural',
          'landscape',
          'landscape-primary',
          'landscape-secondary',
          'portrait',
          'portrait-primary',
          'portrait-secondary',
        ],
        type: 'string',
        meta: { pwa: 'orientation' },
      },
      backgroundColor: {
        description:
          "Defines the expected “background color” for the website. This value repeats what is already available in the site’s CSS, but can be used by browsers to draw the background color of a shortcut when the manifest is available before the stylesheet has loaded. This creates a smooth transition between launching the web application and loading the site's content.",
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: {
          pwa: 'background_color',
          regexHuman: "6 character long hex color string, for example, `'#000000'`",
        },
      },
      barStyle: {
        description:
          'If content is set to default, the status bar appears normal. If set to black, the status bar has a black background. If set to black-translucent, the status bar is black and translucent. If set to default or black, the web content is displayed below the status bar. If set to black-translucent, the web content is displayed on the entire screen, partially obscured by the status bar.',
        enum: ['default', 'black', 'black-translucent'],
        type: 'string',
        fallback: 'black-translucent',
        meta: { html: 'apple-mobile-web-app-status-bar-style', pwa: 'name' },
      },
      preferRelatedApplications: {
        description:
          'Hints for the user agent to indicate to the user that the specified native applications (defined in expo.ios and expo.android) are recommended over the website.',
        type: 'boolean',
        fallback: true,
        meta: { pwa: 'prefer_related_applications' },
      },
      dangerous: {
        description: 'Experimental features. These will break without deprecation notice.',
        type: 'object',
        properties: {},
        additionalProperties: true,
      },
      splash: {
        description: 'Configuration for PWA splash screens.',
        type: 'object',
        properties: {
          backgroundColor: {
            description: 'Color to fill the loading screen background',
            type: 'string',
            pattern: '^#|(&#x23;)\\d{6}$',
            meta: { regexHuman: "6 character long hex color string, for example, `'#000000'`" },
          },
          resizeMode: {
            description:
              'Determines how the `image` will be displayed in the splash loading screen. Must be one of `cover` or `contain`, defaults to `contain`.',
            enum: ['cover', 'contain'],
            type: 'string',
          },
          image: {
            description:
              'Local path or remote URL to an image to fill the background of the loading screen. Image size and aspect ratio are up to you. Must be a .png.',
            type: 'string',
            meta: {
              asset: true,
              contentTypePattern: '^image/png$',
              contentTypeHuman: '.png image',
            },
          },
        },
        meta: {
          bareWorkflow:
            'Use [expo-splash-screen](https://github.com/expo/expo/tree/master/packages/expo-splash-screen#expo-splash-screen)',
        },
      },
      config: {
        description:
          'Firebase web configuration. Used by the expo-firebase packages on both web and native. [Learn more](https://firebase.google.com/docs/reference/js/firebase.html#initializeapp)',
        type: 'object',
        properties: {
          firebase: {
            type: 'object',
            properties: {
              apiKey: { type: 'string' },
              authDomain: { type: 'string' },
              databaseURL: { type: 'string' },
              projectId: { type: 'string' },
              storageBucket: { type: 'string' },
              messagingSenderId: { type: 'string' },
              appId: { type: 'string' },
              measurementId: { type: 'string' },
            },
          },
        },
      },
    },
  },
  facebookAppId: {
    description:
      'Used for all Facebook libraries. Set up your Facebook App ID at https://developers.facebook.com.',
    type: 'string',
    pattern: '^[0-9]+$',
    meta: {
      bareWorkflow:
        'For details, check the [Facebook iOS SDK documentation](https://developers.facebook.com/docs/facebook-login/ios/#4--configure-your-project) and [Android SDK documentation](https://developers.facebook.com/docs/facebook-login/android#manifest)',
    },
  },
  facebookAutoInitEnabled: {
    description:
      'Whether the Facebook SDK should be initialized automatically. The default in Expo (Client and in standalone apps) is `false`.',
    type: 'boolean',
  },
  facebookAutoLogAppEventsEnabled: {
    description:
      "Whether the Facebook SDK log app events automatically. If you don't set this property, Facebook's default will be used. (Applicable only to standalone apps.) Note: The Facebook SDK must be initialized for app events to work. You may autoinitialize Facebook SDK by setting `facebookAutoInitEnabled` to `true`",
    type: 'boolean',
    meta: {
      bareWorkflow:
        'For details, check the [Facebook iOS SDK documentation](https://developers.facebook.com/docs/facebook-login/ios/#4--configure-your-project) and [Android SDK documentation](https://developers.facebook.com/docs/facebook-login/android#manifest)',
    },
  },
  facebookAdvertiserIDCollectionEnabled: {
    description:
      "Whether the Facebook SDK should collect advertiser ID properties, like the Apple IDFA and Android Advertising ID, automatically. If you don't set this property, Facebook's default policy will be used. (Applicable only to standalone apps.)",
    type: 'boolean',
    meta: {
      bareWorkflow:
        'For details, check the [Facebook iOS SDK documentation](https://developers.facebook.com/docs/facebook-login/ios/#4--configure-your-project) and [Android SDK documentation](https://developers.facebook.com/docs/facebook-login/android#manifest)',
    },
  },
  facebookDisplayName: {
    description: 'Used for native Facebook login.',
    type: 'string',
    meta: {
      bareWorkflow:
        'For details, check the [Facebook iOS SDK documentation](https://developers.facebook.com/docs/facebook-login/ios/#4--configure-your-project) and [Android SDK documentation](https://developers.facebook.com/docs/facebook-login/android#manifest)',
    },
  },
  facebookScheme: {
    description:
      "Used for Facebook native login. Starts with 'fb' and followed by a string of digits, like 'fb1234567890'. You can find your scheme [here](https://developers.facebook.com/docs/facebook-login/ios)in the 'Configuring Your info.plist' section (only applicable to standalone apps and custom Expo clients).",
    type: 'string',
    pattern: '^fb[0-9]+[A-Za-z]*$',
    meta: {
      bareWorkflow:
        'For details, check the [Facebook iOS SDK documentation](https://developers.facebook.com/docs/facebook-login/ios/#4--configure-your-project) and [Android SDK documentation](https://developers.facebook.com/docs/facebook-login/android#manifest)',
    },
  },
  isDetached: { description: 'Is app detached', type: 'boolean', meta: { autogenerated: true } },
  detach: {
    description: 'Extra fields needed by detached apps',
    type: 'object',
    properties: {},
    meta: { autogenerated: true },
    additionalProperties: true,
  },
  splash: {
    description: 'Configuration for loading and splash screen for standalone apps.',
    type: 'object',
    properties: {
      backgroundColor: {
        description: 'Color to fill the loading screen background',
        type: 'string',
        pattern: '^#|(&#x23;)\\d{6}$',
        meta: {
          regexHuman: "6 character long hex color string, for example, `'#000000'`",
          bareWorkflow:
            'For Android, edit the `colorPrimary` item in `android/app/src/main/res/values/colors.xml`',
        },
      },
      resizeMode: {
        description:
          'Determines how the `image` will be displayed in the splash loading screen. Must be one of `cover` or `contain`, defaults to `contain`.',
        enum: ['cover', 'contain'],
        type: 'string',
      },
      image: {
        description:
          'Local path or remote URL to an image to fill the background of the loading screen. Image size and aspect ratio are up to you. Must be a .png.',
        type: 'string',
        meta: { asset: true, contentTypePattern: '^image/png$', contentTypeHuman: '.png image' },
      },
    },
    meta: {
      bareWorkflow:
        "To change your app's icon, edit or replace the files in `ios/<PROJECT-NAME>/Assets.xcassets/AppIcon.appiconset` (we recommend using Xcode), and `android/app/src/main/res/mipmap-<RESOLUTION>` (Android Studio can [generate the appropriate image files for you](https://developer.android.com/studio/write/image-asset-studio)). Be sure to follow the guidelines for each platform ([iOS](https://developer.apple.com/design/human-interface-guidelines/ios/icons-and-images/app-icon/), [Android 7.1 and below](https://material.io/design/iconography/#icon-treatments), and [Android 8+](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)) and to provide your new icon in each required size.",
    },
  },
  hooks: {
    description: 'Configuration for scripts to run to hook into the publish process',
    type: 'object',
    additionalProperties: false,
    properties: {
      postPublish: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
          properties: {
            file: { type: 'string' },
            config: { type: 'object', additionalProperties: true, properties: {} },
          },
        },
      },
      postExport: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: true,
          properties: {
            file: { type: 'string' },
            config: { type: 'object', additionalProperties: true, properties: {} },
          },
        },
      },
    },
  },
  assetBundlePatterns: {
    description:
      'An array of file glob strings which point to assets that will be bundled within your standalone app binary. Read more in the [Offline Support guide](https://docs.expo.io/versions/latest/guides/offline-support.html)',
    type: 'array',
    items: { type: 'string' },
  },
  experiments: {
    description:
      'Enable experimental features that may be unstable, unsupported, or removed without deprecation notices.',
    type: 'object',
    additionalProperties: false,
    properties: {
      redesignedLogBox: {
        type: 'boolean',
        description:
          'Use the unstable LogBox re-design available in React Native 0.62. This option is only available in SDK 38.',
        fallback: false,
      },
      turboModules: {
        description:
          'Enables Turbo Modules, which are a type of native modules that use a different way of communicating between JS and platform code. When installing a Turbo Module you will need to enable this experimental option (the library still needs to be a part of Expo SDK already, like react-native-reanimated v2). Turbo Modules do not support remote debugging and enabling this option will disable remote debugging.',
        type: 'boolean',
        fallback: false,
      },
    },
  },
};
