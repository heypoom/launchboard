import {types} from 'mobx-state-tree'

import {Color} from './color'

import {range} from '../launchpad/utils'

const {model, array, reference, identifier, optional} = types

const Scene = array(reference(Color))

const defaultPalette = ['none', 'blue', 'pink', 'yellow']

const blankScene = range(0, 64).map(() => 'none')

/**
 * Animation defines the animation that can be triggered.
 */
export const Animation = model('Animation', {
  name: identifier,
  palette: optional(Scene, defaultPalette),
  frames: optional(array(Scene), [blankScene]),
})
