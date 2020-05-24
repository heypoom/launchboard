import {types} from 'mobx-state-tree'

import {Color} from './color'
import {Sound} from './sound'
import {Animation} from './animation'

const {model, reference, maybeNull, identifier} = types

/**
 * Slot defines each slot of the 64 launchpad buttons.
 */
export const Slot = model('Slot', {
  slot: identifier,
  color: maybeNull(reference(Color)),
  sound: maybeNull(reference(Sound)),
  animation: maybeNull(reference(Animation)),
})
