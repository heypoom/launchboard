import {types, SnapshotIn, Instance} from 'mobx-state-tree'

import {Slot} from './slot'
import {Sound} from './sound'
import {Keybind} from './keybind'
import {Color, newColor} from './color'
import {Animation} from './animation'

import {range} from '../launchpad/utils'

const {model, map, array, reference, optional, maybeNull} = types

const blankScene = range(0, 63).map(() => 'none')

interface SlotConfig {
  color?: string
  sound?: string
  animation?: string
}

/**
 * Board defines the save state of the entire board.
 */
let Scene = array(reference(Color))

let Schema = {
  slots: map(Slot),
  colors: map(Color),
  sounds: map(Sound),
  keybind: map(Keybind),
  animations: map(Animation),
  animation: maybeNull(reference(Animation)),
  scene: optional(Scene, blankScene),
}

export let Board = model('Board', Schema)
  .actions(self => ({
    add(slot: string, color?: string, sound?: string, animation?: string) {
      this.addSlot(slot, {color, sound, animation})
    },

    addSlot(slot: string, config: SlotConfig) {
      self.slots.put({slot, ...config})

      this.setupSlot(slot)
    },

    setupSlot(slot: string) {
      const config = self.slots.get(slot)
      if (!config) return

      const {color, sound} = config
      if (!color) return

      this.setScene(slot, color.name)
      if (!sound) return

      this.setupPlaybackEnd(slot, sound.name, color.name)
    },

    setupPlaybackEnd: (slot: string, sound: string, color: string) => {},

    addColor(name: string, ui: string, deviceSpec: number[]) {
      self.colors.put(newColor(name, ui, deviceSpec))
    },

    addSound(name: string, src: string) {
      self.sounds.put({name, src})
    },

    trigger(slot: string) {
      console.log('Trigger at', slot)

      this.draw(slot)

      const config = self.slots.get(slot)
      if (!config) return

      const {sound} = config

      if (sound) {
        this.setScene(slot, 'red')
        sound.play()
      }
    },

    setScene(slot: string, colorName: string) {
      let color = self.colors.get(colorName)
      if (!color) return

      self.scene[Number(slot) - 1] = color
    },

    setKeybindColor(name: string, colorName: string) {
      let key = self.keybind.get(name)
      let color = self.colors.get(colorName)
      if (!key || !color) return

      key.color = color
    },

    addAnimation(name: string = 'default') {
      let animation = self.animations.put({name})

      self.animation = animation
    },

    draw(slot: string) {
      if (!self.animation) this.addAnimation()
      if (!self.animation) return

      let palette = self.animation.palette

      let color = self.scene[Number(slot) - 1]
      if (!color) return

      let id = (palette.indexOf(color) + 1) % palette.length
      let next = palette[id]

      this.setScene(slot, next.name)

      self.animation.frames[0].replace(self.scene)
    },

    clearScene() {
      let empty = range(0, 63).map(() => 'none')
      self.scene.replace(empty)
    },
  }))
  .views(self => ({
    get uiScene() {
      return self.scene.map(s => s.ui)
    },
  }))

export type BoardState = SnapshotIn<typeof Board>
export type BoardModel = Instance<typeof Board>
