import { Platform } from '@unimodules/react-native-adapter';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { resolveScheme } from 'expo-linking/build/Schemes';
import qs from 'qs';
const { manifest } = Constants;
export class SessionUrlProvider {
    getDefaultReturnUrl(urlPath) {
        const hostAddress = SessionUrlProvider.getHostAddress();
        const isExpoHosted = hostAddress.hostUri &&
            (/^(.*\.)?(expo\.io|exp\.host|exp\.direct|expo\.test)(:.*)?(\/.*)?$/.test(hostAddress.hostUri) ||
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
        }
        else {
            path = '';
        }
        if (urlPath) {
            path = [path, urlPath].filter(Boolean).join('/');
        }
        let { parameters } = hostAddress;
        if (parameters) {
            parameters = `?${parameters}`;
        }
        else {
            parameters = '';
        }
        hostUri = SessionUrlProvider.removeTrailingSlash(hostUri);
        return encodeURI(`${scheme}://${hostUri}${path}${parameters}`);
    }
    getStartUrl(authUrl, returnUrl) {
        const queryString = qs.stringify({
            authUrl,
            returnUrl,
        });
        return `${this.getRedirectUrl()}/start?${queryString}`;
    }
    getRedirectUrl(urlPath) {
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
                }
                else if (Constants.executionEnvironment === ExecutionEnvironment.StoreClient) {
                    nextSteps =
                        ' Please report this as a bug with the contents of `expo config --type public`.';
                }
            }
            throw new Error('Cannot use AuthSession proxy because the project ID is not defined.' + nextSteps);
        }
        const redirectUrl = `${SessionUrlProvider.BASE_URL}/${legacyExpoProjectId}`;
        if (__DEV__) {
            SessionUrlProvider.warnIfAnonymous(legacyExpoProjectId, redirectUrl);
            // TODO: Verify with the dev server that the manifest is up to date.
        }
        return redirectUrl;
    }
    static getHostAddress() {
        let hostUri = Constants.manifest?.hostUri;
        if (!hostUri &&
            (ExecutionEnvironment.StoreClient === Constants.executionEnvironment || resolveScheme({}))) {
            if (!Constants.linkingUri) {
                hostUri = '';
            }
            else {
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
    static warnIfAnonymous(id, url) {
        if (id.startsWith('@anonymous/')) {
            console.warn(`You are not currently signed in to Expo on your development machine. As a result, the redirect URL for AuthSession will be "${url}". If you are using an OAuth provider that requires whitelisting redirect URLs, we recommend that you do not whitelist this URL -- instead, you should sign in to Expo to acquired a unique redirect URL. Additionally, if you do decide to publish this app using Expo, you will need to register an account to do it.`);
        }
    }
    static removeScheme(url) {
        return url.replace(/^[a-zA-Z0-9+.-]+:\/\//, '');
    }
    static removeLeadingSlash(url) {
        return url.replace(/^\//, '');
    }
    static removeTrailingSlash(url) {
        return url.replace(/\/$/, '');
    }
}
SessionUrlProvider.BASE_URL = `https://auth.expo.io`;
SessionUrlProvider.SESSION_PATH = 'expo-auth-session';
export default new SessionUrlProvider();
//# sourceMappingURL=SessionUrlProvider.js.map