import { EventEmitter } from 'fbemitter';
import React from 'react';

import NativeAppLoading from './AppLoadingNativeWrapper';

type Props =
  | {
      /**
       * Optional, you can do this process manually if you prefer.
       * This is mainly for backwards compatibility and it is not recommended.
       *
       * When provided, requires providing `onError` prop as well.
       * @deprecated
       */
      startAsync: () => Promise<void>;

      /**
       * If `startAsync` throws an error, it is caught and passed into the provided function.
       * @deprecated
       */
      onError: (error: Error) => void;

      /**
       * Called when `startAsync` resolves or rejects.
       * This should be used to set state and unmount the `AppLoading` component.
       * @deprecated
       */
      onFinish: () => void;

      /**
       * Whether to hide the native splash screen as soon as you unmount the `AppLoading` component.
       * Auto-hiding is enabled by default.
       */
      autoHideSplash?: boolean;
    }
  | {
      /**
       * Whether to hide the native splash screen as soon as you unmount the `AppLoading` component.
       * Auto-hiding is enabled by default.
       */
      autoHideSplash?: boolean;
    };

export default class AppLoading extends React.Component<Props> {
  isMounted: boolean = false;

  componentDidMount() {
    this.isMounted = true;
    emitEvent('componentDidMount');

    this.startLoadingAppResourcesAsync().catch(error => {
      console.error(`AppLoading threw an unexpected error when loading:\n${error.stack}`);
    });
  }

  componentWillUnmount() {
    this.isMounted = false;
    emitEvent('componentWillUnmount');
  }

  private async startLoadingAppResourcesAsync() {
    if (!('startAsync' in this.props)) {
      return;
    }

    if (!('onFinish' in this.props)) {
      throw new Error('AppLoading onFinish prop is required if startAsync is provided');
    }

    if (!('onError' in this.props)) {
      throw new Error('AppLoading onError prop is required if startAsync is provided');
    }

    try {
      await this.props.startAsync();
    } catch (e) {
      if (!this.isMounted) {
        return;
      }
      this.props.onError(e);
    } finally {
      if (!this.isMounted) {
        return;
      }
      // If we get to this point then we know that either there was no error, or the error was handled.
      this.props.onFinish();
    }
  }

  render() {
    return <NativeAppLoading {...this.props} />;
  }
}

let lifecycleEmitter: EventEmitter | null = null;

function emitEvent(event: string) {
  if (lifecycleEmitter) {
    lifecycleEmitter.emit(event);
  }
}

export function getAppLoadingLifecycleEmitter(): EventEmitter {
  if (!lifecycleEmitter) {
    lifecycleEmitter = new EventEmitter();
  }
  return lifecycleEmitter;
}
