import { requireNativeViewManager } from '@unimodules/core';
import nullthrows from 'nullthrows';
import React from 'react';
import { AdIconViewContext } from './withNativeAd';
export default class AdIconView extends React.Component {
    render() {
        return (React.createElement(AdIconViewContext.Consumer, null, (contextValue) => {
            const context = nullthrows(contextValue);
            return React.createElement(NativeAdIconView, Object.assign({}, this.props, { ref: context.nativeRef }));
        }));
    }
}
export const NativeAdIconView = requireNativeViewManager('AdIconView');
//# sourceMappingURL=AdIconView.js.map