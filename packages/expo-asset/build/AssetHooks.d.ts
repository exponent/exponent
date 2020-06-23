import { Asset } from './Asset';
/**
 * Load one or many of asset modules to use in your app.
 * After (pre)loading these assets, you can use the module to load the downloaded asset in your app.
 * It returns a list of assets, when loaded.
 * If something went wrong when loading the assets, the error is returned.
 *
 * Note, the assets are not "reloaded" when you dynamically change the asset list.
 *
 * @see https://docs.expo.io/versions/latest/sdk/asset/
 * @example
 * ```tsx
 * const [assets, error] = useAssets(require('path/to/asset.jpg'));
 *
 * return !assets ? null : <Image source={require('path/to/asset.jpg')} />;
 * ```
 */
export declare function useAssets(moduleIds: number | number[]): [Asset[]?, Error?];
