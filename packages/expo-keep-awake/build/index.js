import { useEffect } from 'react';
import ExpoKeepAwake from './ExpoKeepAwake';
const ExpoKeepAwakeTag = 'ExpoKeepAwakeDefaultTag';
// @needsAudit
/**
 * A React hook to keep the screen awake for as long as the owner component is mounted.
 * The optionally provided `tag` argument is used when activating and deactivating the keep-awake
 * feature. If unspecified, the default `tag` is used. See the documentation for `activateKeepAwake`
 * below to learn more about the `tag` argument.
 * @param tag *Optional*
 */
export function useKeepAwake(tag = ExpoKeepAwakeTag) {
    useEffect(() => {
        activateKeepAwake(tag);
        return () => deactivateKeepAwake(tag);
    }, [tag]);
}
// @needsAudit
/**
 * Prevents the screen from sleeping until `deactivateKeepAwake` is called with the same `tag` value.
 *
 * If the `tag` argument is specified, the screen will not sleep until you call `deactivateKeepAwake`
 * with the same `tag` argument. When using multiple `tags` for activation you'll have to deactivate
 * each one in order to re-enable screen sleep. If tag is unspecified, the default `tag` is used.
 * @param tag *Optional* - Tag to lock screen sleep prevention. If not provided, the default tag is used.
 */
export function activateKeepAwake(tag = ExpoKeepAwakeTag) {
    if (ExpoKeepAwake.activate)
        ExpoKeepAwake.activate(tag);
}
// @needsAudit
/**
 * Releases the lock on screen-sleep prevention associated with the given `tag` value. If `tag`
 * is unspecified, it defaults to the same default tag that `activateKeepAwake` uses.
 * @param tag *Optional* - Tag to release the lock on screen sleep prevention. If not provided,
 * the default tag is used.
 */
export function deactivateKeepAwake(tag = ExpoKeepAwakeTag) {
    if (ExpoKeepAwake.deactivate)
        ExpoKeepAwake.deactivate(tag);
}
//# sourceMappingURL=index.js.map