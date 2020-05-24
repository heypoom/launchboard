import {types} from 'mobx-state-tree'

import {Color as Light} from '../launchpad/specs'

const {model, string, array, number, identifier} = types

/**
 * Color defines the color of the physical button and ui interface.
 */
export let Color = model('Color', {
  name: identifier,
  ui: string,
  device: array(number),
})

export function newColor(name: string, ui: string, trait: number[]) {
  let device = typeof trait === 'number' ? Light(trait) : trait

  return {name, ui, device}
}
