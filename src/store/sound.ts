import {types} from 'mobx-state-tree'

import {soundManager} from '../modules/sound-manager'

const {model, string, number, optional, identifier, boolean} = types

let Schema = {
  name: identifier,
  src: string,
  volume: optional(number, 1),
}

/**
 * Sound defines the sound that can be played.
 */
export let Sound = model('Sound', Schema).actions(self => ({
  play() {
    soundManager.play(self.name)
  },
}))
