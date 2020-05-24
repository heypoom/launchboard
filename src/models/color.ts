import {types} from 'mobx-state-tree'

import {Color as Light} from '../launchpad/specs'

const {model, string, array, number, identifier} = types

/**
 * Color defines the color of the physical button and web interface.
 */
export const Color = model('Color', {
  name: identifier,
  web: string,
  device: array(number),
})

export function newColor(name: string, web: string, trait: number[]) {
  let device = typeof trait === 'number' ? Light(trait) : trait

  return {name, web, device}
}
