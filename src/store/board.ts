import {types, SnapshotIn, Instance} from 'mobx-state-tree'

import {Slot} from './slot'
import {Sound} from './sound'
import {Keybind} from './keybind'
import {Color, newColor} from './color'
import {Animation} from './animation'

import {blankScene} from '../constants/animations'

const {
  model,
  map,
  array,
  reference,
  optional,
  maybeNull,
  number,
  boolean,
} = types

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
  currentFrame: optional(number, 0),
  isAnimating: optional(boolean, false),
}

let timer: NodeJS.Timeout

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const Board = model('Board', Schema)
  .views(self => ({
    get uiScene() {
      return self.scene.map(s => s.ui)
    },

    get frames() {
      return self.animation?.frames
    },

    get frame() {
      if (!this.frames) return null
      if (self.currentFrame >= this.frames.length) return null

      return this.frames[self.currentFrame]
    },

    getSlot: (slot: string) => self.slots.get(slot),
    getSound: (sound: string) => self.sounds.get(sound),
  }))
  .actions(self => ({
    add(slot: string, color?: string, sound?: string, animation?: string) {
      this.addSlot(slot, {color, sound, animation})
    },

    addSlot(slot: string, config: SlotConfig) {
      self.slots.put({slot, ...config})

      this.setupSlot(slot)
    },

    deleteSlot(slot: string) {
      self.slots.delete(slot)

      this.setScene(slot, 'none')
    },

    setupSlot(slot: string) {
      const config = self.slots.get(slot)
      if (!config) return

      const {color} = config
      if (color) this.setScene(slot, color.name)
    },

    addColor(name: string, ui: string, deviceSpec: number[]) {
      self.colors.put(newColor(name, ui, deviceSpec))
    },

    addSound(name: string, src: string) {
      self.sounds.put({name, src})
    },

    trigger(slot: string) {
      const config = self.slots.get(slot)
      if (!config) return this.draw(slot)

      if (config.sound) {
        this.setScene(slot, 'red')

        this.playSound(config.sound.name)
      }

      if (config.animation) {
        this.triggerAnimation(config.animation.name)
      }
    },

    playSound(sound: string) {},

    setScene(slot: string, colorName: string) {
      let color = self.colors.get(colorName)
      if (!color) return

      let id = Number(slot) - 1

      self.scene[id] = color
      if (self.frame) self.frame[id] = color
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
    },

    clearScene() {
      self.scene.replace(blankScene)
    },

    syncFrameToScene() {
      console.log('Frame', self.currentFrame + 1, 'of', self.frames?.length)

      if (self.frame) self.scene.replace(self.frame)
    },

    syncSceneToFrame() {
      self.frame?.replace(self.scene)
    },

    replaceScene(scene: any) {
      self.scene.replace(scene)
    },

    nextFrame() {
      if (self.frames && self.currentFrame >= self.frames.length - 1) {
        self.frames.push(blankScene)
      }

      self.currentFrame++

      this.syncFrameToScene()
    },

    prevFrame() {
      if (self.currentFrame < 1) return
      self.currentFrame--

      this.syncFrameToScene()
    },

    async triggerAnimation(name = 'default') {
      let animation = self.animations.get(name)
      if (!animation) return

      const {frames} = animation

      for (let current = 0; current < frames.length; current++) {
        const frame = frames[current]
        this.replaceScene(frame)

        await delay(1000 / animation.fps)
      }
    },

    playAnimation() {
      if (!self.animation) return

      if (self.isAnimating) {
        self.isAnimating = false
        clearInterval(timer)
        return
      }

      self.isAnimating = true

      timer = setInterval(this.tick.bind(this), 1000 / self.animation.fps)
    },

    tick() {
      if (!self.frames) return

      if (self.currentFrame > self.frames.length - 1) {
        self.currentFrame = 0
      }

      this.syncFrameToScene()

      self.currentFrame++
    },
  }))

export type BoardState = SnapshotIn<typeof Board>
export type BoardModel = Instance<typeof Board>
