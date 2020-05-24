import {types} from 'mobx-state-tree'

import {Color} from './color'

import {device} from '../launchpad'
import {range} from '../launchpad/utils'

import {renderScene} from '../modules/renderer'
import {Scene, Color as ColorSpec} from '../types/animation'

const {model, array, number, reference, identifier} = types

export const blank = (): Scene => range(0, 64).map(() => 0)

/**
 * Animation defines the animation that can be triggered.
 */
export let Animation = model('Animation', {
  name: identifier,
  current: number,
  frames: array(array(number)),
  palette: array(reference(Color)),
})

Animation = Animation.actions(self => ({
  navigate(offset = 1) {
    self.current += offset

    if (self.current < 0) self.current = self.frames.length - 1

    this.update()
  },

  next() {
    this.navigate(1)
  },

  prev() {
    this.navigate(-1)
  },

  clear() {
    self.frames[self.current].clear()
    device.fill(0)
  },

  tick() {
    self.current++
    if (self.current > self.frames.length) self.current = 0

    this.update()
  },

  update() {
    let scene = self.frames[self.current]
    let palette = self.palette.toJSON() as ColorSpec[]

    renderScene(scene, palette, device)
  },
}))
