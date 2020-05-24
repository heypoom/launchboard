import {types} from 'mobx-state-tree'

import {Slot} from './slot'
import {Sound} from './sound'
import {Keybind} from './keybind'
import {Color, newColor} from './color'
import {Animation} from './animation'

import {range} from '../launchpad/utils'
import {soundManager} from '../modules/sound-manager'

const {model, map, array, reference, optional} = types

const blank = range(0, 64).map(() => 'none')

interface SlotConfig {
  color?: string
  sound?: string
  animation?: string
}

/**
 * Board defines the save state of the entire board.
 */
let Schema = {
  slots: map(Slot),
  colors: map(Color),
  sounds: map(Sound),
  keybind: map(Keybind),
  animations: map(Animation),
  scene: optional(array(reference(Color)), blank),
}

export let Board = model('Board', Schema).actions(self => ({
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

    soundManager.onEnd(sound.name, () => this.setScene(slot, color.name))
  },

  addColor(name: string, web: string, deviceSpec: number[]) {
    self.colors.put(newColor(name, web, deviceSpec))
  },

  addSound(name: string, src: string) {
    self.sounds.put({name, src})

    soundManager.load(name, {src})
  },

  trigger(slot: string) {
    this.setScene(slot, 'red')

    const config = self.slots.get(slot)
    if (!config) return

    const {color, animation, sound} = config
    sound?.play()
  },

  setScene(slot: string, colorName: string) {
    let color = self.colors.get(colorName)
    if (!color) return

    self.scene[slot] = color
  },

  setKeybindColor(name: string, colorName: string) {
    let key = self.keybind.get(name)
    let color = self.colors.get(colorName)
    if (!key || !color) return

    key.color = color
  },
}))
