import amplitude from 'amplitude-js'

const ExpoAmplitude = {
  initialize: (apiKey: string, options?: amplitude.Config) => {
    amplitude.getInstance().init(apiKey, undefined, options)
  },
  setUserId: amplitude.getInstance().setUserId,
  setUserProperties: amplitude.getInstance().setUserProperties,
  clearUserProperties: amplitude.getInstance().clearUserProperties,
  logEvent: amplitude.getInstance().logEvent,
  logEventWithProperties: (
    eventName: string,
    properties: { [name: string]: any },
  ) => {
    amplitude.getInstance().logEvent(eventName, properties)
  },
  setGroup: amplitude.getInstance().setGroup,
}

export default ExpoAmplitude
