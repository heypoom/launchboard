import {types, Instance} from 'mobx-state-tree'

const {model, string, number, optional, identifier, boolean} = types

/**
 * Sound defines the sound that can be played.
 */
export let Sound = model('Sound', {
  name: identifier,
  src: string,
  volume: optional(number, 1),
})

export type SoundModel = Instance<typeof Sound>
