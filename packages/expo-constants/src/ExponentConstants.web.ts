import uuidv4 from 'uuid/v4';
import UAParser from 'ua-parser-js';

const ExpoPackageJson = require('expo/package.json');

const parser = new UAParser();
const ID_KEY = 'EXPO_CONSTANTS_INSTALLATION_ID';

declare var process: any;

const _sessionId = uuidv4();

export default {
  get name(): string {
    return 'ExponentConstants';
  },
  get appOwnership() {
    return 'expo';
  },
  get installationId() {
    let installationId = localStorage.getItem(ID_KEY);
    if (!installationId) {
      installationId = uuidv4();
      localStorage.setItem(ID_KEY, installationId as string);
    }

    return installationId;
  },
  get sessionId(): string {
    return _sessionId;
  },
  get platform(): object {
    return { web: UAParser(navigator.userAgent) };
  },
  get isDevice(): boolean {
    // TODO: Bacon: Possibly want to add information regarding simulators
    return true;
  },
  get expoVersion(): string {
    return ExpoPackageJson.version;
  },
  get linkingUri(): string {
    return location.origin + location.pathname;
  },
  get expoRuntimeVersion(): string | null {
    return null;
  },
  get deviceName(): string | null {
    const { browser, engine, os: OS } = parser.getResult();

    return browser.name || engine.name || OS.name || null;
  },
  get systemFonts(): string[] {
    // TODO: Bacon: Maybe possible.
    return [];
  },
  get statusBarHeight(): number {
    return 0;
  },
  get deviceYearClass(): string | null {
    // TODO: Bacon: The android version isn't very accurate either, maybe we could try and guess this value.
    console.log(`ExponentConstants.deviceYearClass: is unimplemented on web.`);
    return null;
  },
  get manifest(): { [manifestKey: string]: any } {
    return process.env.APP_MANIFEST || {};
  },
  async getWebViewUserAgentAsync(): Promise<string> {
    return navigator.userAgent;
  },
};
