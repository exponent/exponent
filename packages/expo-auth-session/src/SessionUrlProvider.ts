import { Platform } from '@unimodules/react-native-adapter';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { resolveScheme } from 'expo-linking/build/Schemes';
import qs from 'qs';

const { manifest } = Constants;

export class SessionUrlProvider {
  private static readonly BASE_URL = `https://auth.expo.io`;
  private static readonly SESSION_PATH = 'expo-auth-session';

  getDefaultReturnUrl(urlPath?: string): string {
    const hostAddress = SessionUrlProvider.getHostAddress();
    const isExpoHosted =
      hostAddress.hostUri &&
      (/^(.*\.)?(expo\.io|exp\.host|exp\.direct|expo\.test)(:.*)?(\/.*)?$/.test(
        hostAddress.hostUri
      ) ||
        (!!manifest.developer &&
          Constants.executionEnvironment === ExecutionEnvironment.StoreClient));

    let scheme = 'exp';
    let path = SessionUrlProvider.SESSION_PATH;
    const manifestScheme = resolveScheme({});

    const isCustomEnvironment = [
      ExecutionEnvironment.Standalone,
      ExecutionEnvironment.Bare,
    ].includes(Constants.executionEnvironment);
    if (isCustomEnvironment && manifestScheme) {
      scheme = manifestScheme;
    }

    let hostUri = hostAddress.hostUri || '';
    if (isCustomEnvironment && manifestScheme && isExpoHosted) {
      hostUri = '';
    }

    if (path) {
      if (isExpoHosted && hostUri) {
        path = `/--/${SessionUrlProvider.removeLeadingSlash(path)}`;
      }

      if (!path.startsWith('/')) {
        path = `/${path}`;
      }
    } else {
      path = '';
    }

    if (urlPath) {
      path = [path, urlPath].filter(Boolean).join('/');
    }

    let { parameters } = hostAddress;
    if (parameters) {
      parameters = `?${parameters}`;
    } else {
      parameters = '';
    }

    hostUri = SessionUrlProvider.removeTrailingSlash(hostUri);
    return encodeURI(`${scheme}://${hostUri}${path}${parameters}`);
  }

  getStartUrl(authUrl: string, returnUrl: string): string {
    const queryString = qs.stringify({
      authUrl,
      returnUrl,
    });

    return `${this.getRedirectUrl()}/start?${queryString}`;
  }

  getRedirectUrl(urlPath?: string): string {
    if (Platform.OS === 'web') {
      return [window.location.origin, urlPath].filter(Boolean).join('/');
    }

    const legacyExpoProjectId = manifest.currentFullName || manifest.id;

    if (!legacyExpoProjectId) {
      let nextSteps = '';
      if (__DEV__) {
        if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
          nextSteps =
            ' Please ensure you have the latest version of expo-constants installed and rebuild your native app. You can verify that currentFullName is defined by running `expo config --type public | grep currentFullName`';
        } else if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
          nextSteps =
            ' Please report this as a bug with the contents of `expo config --type public`.';
        }
      }
      throw new Error(
        'Cannot use AuthSession proxy because the project ID is not defined.' + nextSteps
      );
    }

    const redirectUrl = `${SessionUrlProvider.BASE_URL}/${legacyExpoProjectId}`;
    if (__DEV__) {
      SessionUrlProvider.warnIfAnonymous(legacyExpoProjectId, redirectUrl);
      // TODO: Verify with the dev server that the manifest is up to date.
      // if (Constants.executionEnvironment === ExecutionEnvironment.Bare) {
      //   SessionUrlProvider.warnIfBareManifestNeedsUpdate(legacyExpoProjectId);
      // }
    }
    return redirectUrl;
  }

  private static getHostAddress(): { hostUri: string; parameters: string | undefined } {
    let hostUri: string = Constants.manifest?.hostUri;
    if (
      !hostUri &&
      (ExecutionEnvironment.StoreClient === Constants.executionEnvironment || resolveScheme({}))
    ) {
      if (!Constants.linkingUri) {
        hostUri = '';
      } else {
        // we're probably not using up-to-date xdl, so just fake it for now
        // we have to remove the /--/ on the end since this will be inserted again later
        hostUri = SessionUrlProvider.removeScheme(Constants.linkingUri).replace(/\/--(\/.*)?$/, '');
      }
    }

    const uriParts = hostUri?.split('?');
    const parameters = uriParts?.[1];
    if (uriParts?.length > 0) {
      hostUri = uriParts[0];
    }

    return { hostUri, parameters };
  }

  private static warnIfAnonymous(id, url): void {
    if (id.startsWith('@anonymous/')) {
      console.warn(
        `You are not currently signed in to Expo on your development machine. As a result, the redirect URL for AuthSession will be "${url}". If you are using an OAuth provider that requires whitelisting redirect URLs, we recommend that you do not whitelist this URL -- instead, you should sign in to Expo to acquired a unique redirect URL. Additionally, if you do decide to publish this app using Expo, you will need to register an account to do it.`
      );
    }
  }
  private static warnIfBareManifestNeedsUpdate(currentId: string, serverId: string): void {
    console.warn(
      `The app manifest appears to be out of date. Expected Project ID "${serverId}" but found "${currentId}" this will effect redirect URIs. Please rebuild the native app to update the ID.`
    );
  }

  private static removeScheme(url: string) {
    return url.replace(/^[a-zA-Z0-9+.-]+:\/\//, '');
  }

  private static removeLeadingSlash(url: string) {
    return url.replace(/^\//, '');
  }

  private static removeTrailingSlash(url: string) {
    return url.replace(/\/$/, '');
  }
}

export default new SessionUrlProvider();
