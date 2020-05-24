import {types} from 'mobx-state-tree'

const {model, string, number, optional, identifier} = types

/**
 * Sound defines the sound that can be played.
 */
export const Sound = model('Sound', {
  name: identifier,
  src: string,
  volume: optional(number, 1),
})
