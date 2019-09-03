import { StyleProp, ViewStyle } from 'react-native';
export declare type AppleAuthenticationButtonProps = {
    onPress: () => void;
    buttonType: AppleAuthenticationButtonType;
    buttonStyle: AppleAuthenticationButtonStyle;
    cornerRadius?: number;
    style?: StyleProp<ViewStyle>;
};
/**
 * The options you can supply when making a call to
 * `AppleAuthentication.loginAsync()`. None of these options are required.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationopenidrequest)
 * for more details.
 */
export declare type AppleAuthenticationLoginOptions = {
    /**
     * The scope of personal information to which your app is requesting access.
     * The user can choose to deny your app access to any scope at the time of
     * logging in.
     * @defaults `[]` (no scopes).
     */
    requestedScopes?: AppleAuthenticationScope[];
    /**
     * Data that’s returned to you unmodified in the corresponding credential
     * after a successful authentication. Used to verify that the response was
     * from the request you made. Can be used to avoid replay attacks.
     */
    state?: string;
};
/**
 * The options you can supply when making a call to
 * `AppleAuthentication.refreshAsync()`. You must include the ID string of the
 * user whose credentials you'd like to refresh.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationopenidrequest)
 * for more details.
 */
export declare type AppleAuthenticationRefreshOptions = {
    user: string;
    /**
     * The scope of personal information to which your app is requesting access.
     * The user can choose to deny your app access to any scope at the time of
     * refreshing.
     * @defaults `[]` (no scopes).
     */
    requestedScopes?: AppleAuthenticationScope[];
    /**
     * Data that’s returned to you unmodified in the corresponding credential
     * after a successful authentication. Used to verify that the response was
     * from the request you made. Can be used to avoid replay attacks.
     */
    state?: string;
};
/**
 * The options you can supply when making a call to
 * `AppleAuthentication.logout()`. You must include the ID string of the user to
 * sign out.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationopenidrequest)
 * for more details.
 */
export declare type AppleAuthenticationLogoutOptions = {
    user: string;
    /**
     * Data that’s returned to you unmodified in the corresponding credential
     * after a successful authentication. Used to verify that the response was
     * from the request you made. Can be used to avoid replay attacks.
     */
    state?: string;
};
/**
 * The user credentials returned from a successful call to
 * `AppleAuthentication.loginAsync()`, `AppleAuthentication.refreshAsync()`, or
 * `AppleAuthentication.logoutAsync()`.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationappleidcredential)
 * for more details.
 */
export declare type AppleAuthenticationCredential = {
    /**
     * A value indicating the status type of the requested credential. `SUCCESS`
     * if the credential was retrieved successfully, or `CANCEL` if the user
     * canceled the operation before signing in.
     */
    type: AppleAuthenticationStatus;
    /**
     * An identifier associated with the authenticated user. You can use this to
     * check if the user is still authenticated later. This is stable and can be
     * shared across apps released under the same development team. The same user
     * will have a different identifier for apps released by other developers.
     */
    user?: string;
    /**
     * An arbitrary string that your app provided as `state` in the request that
     * generated the credential. Used to verify that the response was from the
     * request you made. Can be used to avoid replay attacks.
     */
    state?: string;
    /**
     * The user’s name. May be null if you didn't request the `FULL_NAME` scope or
     * if the user denied access. May also be null if this is not the first time
     * the user has signed into your app.
     */
    fullName?: AppleAuthenticationFullName;
    /**
     * The user’s email address. Might not be present if you didn't request the
     * `EMAIL` scope. May also be null if this is not the first time the user has
     * signed into your app. If the user chose to withhold their email address,
     * this field will instead contain an obscured email address with an Apple
     * domain.
     */
    email?: string;
    /**
     * A value that indicates whether the user appears to the system to be a real
     * person.
     */
    realUserStatus?: AppleAuthenticationUserDetectionStatus;
    /**
     * A JSON Web Token (JWT) that securely communicates information about the
     * user to your app. Returns null except when a user logs in for the first
     * time on web.
     */
    identityToken?: string;
    /**
     * A short-lived token used by your app for proof of authorization when
     * interacting with the app’s server counterpart. Returns null except when a
     * user logs in for the first time on web.
     */
    authorizationCode?: string;
};
/**
 * An object representing the tokenized portions of the user's full name.
 */
export declare type AppleAuthenticationFullName = {
    namePrefix?: string;
    givenName?: string;
    middleName?: string;
    familyName?: string;
    nameSuffix?: string;
    nickname?: string;
};
export declare type AppleAuthenticationRevokeListener = () => void;
/**
 * Scopes you can request when calling `AppleAuthentication.loginAsync()` or
 * `AppleAuthentication.refreshAsync()`.
 *
 * @note Note that it is possible that you will not be granted all of the scopes
 * which you request. You will still need to handle null values for any fields
 * you request.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationscope)
 * for more details.
 */
export declare enum AppleAuthenticationScope {
    FULL_NAME = 0,
    EMAIL = 1
}
export declare enum AppleAuthenticationOperation {
    /**
     * An operation that depends on the particular kind of credential provider.
     */
    IMPLICIT = 0,
    LOGIN = 1,
    REFRESH = 2,
    LOGOUT = 3
}
/**
 * The state of the credential when checked with
 * `AppleAuthentication.getCredentialStateAsync()`.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asauthorizationappleidprovidercredentialstate)
 * for more details.
 */
export declare enum AppleAuthenticationCredentialState {
    REVOKED = 0,
    AUTHORIZED = 1,
    NOT_FOUND = 2,
    TRANSFERRED = 3
}
/**
 * A value that indicates whether the user appears to be a real person. You get
 * this in the realUserStatus property of a `Credential` object. It can be used
 * as one metric to help prevent fraud.
 *
 * @see [Apple
 * Documentation](https://developer.apple.com/documentation/authenticationservices/asuserdetectionstatus)
 * for more details.
 */
export declare enum AppleAuthenticationUserDetectionStatus {
    UNSUPPORTED = 0,
    UNKNOWN = 1,
    LIKELY_REAL = 2
}
/**
 * Controls the predefined text shown on the authentication button.
 */
export declare enum AppleAuthenticationButtonType {
    SIGN_IN = 0,
    CONTINUE = 1,
    DEFAULT = 2
}
/**
 * Controls the predefined style of the authenticating button.
 */
export declare enum AppleAuthenticationButtonStyle {
    WHITE = 0,
    WHITE_OUTLINE = 1,
    BLACK = 2
}
/**
 * Indicates the status of the attempt to retrieve the requested credential.
 */
export declare enum AppleAuthenticationStatus {
    SUCCESS = "success",
    CANCEL = "cancel"
}
