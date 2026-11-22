// The values this mod keeps in `$.state`.

/** True while the person has hidden the strip with /rider. */
export type IsHidden = boolean

declare module 'claude-code' {
  interface PluginState {
    'gold-cloud-rider': {
      isHidden: IsHidden
    }
  }
}
