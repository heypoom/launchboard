import {ColorManager} from './colors'

import {Launchpad} from '../launchpad'
import {range} from '../launchpad/utils'
import {useTrait} from '../launchpad/specs'
import {ControlCodes} from '../launchpad/controls'
import {toNote, toSlot} from '../launchpad/conversion'

type Scene = number[]

const blank = (): Scene => range(0, 64).map(() => 0)

export class Animator {
  scene: Scene = blank()

  currentFrame = 0
  frames: Scene[] = []

  device: Launchpad
  colors: ColorManager

  palette = ['none', 'blue', 'pink', 'yellow']

  keymap = {
    PREV: ControlCodes.LEFT,
    NEXT: ControlCodes.RIGHT,
    PLAY: ControlCodes.VOLUME,
  }

  controls = {
    [this.keymap.PREV]: this.prev,
    [this.keymap.NEXT]: this.next,
    [this.keymap.PLAY]: this.play,
  }

  constructor(device: Launchpad, colors: ColorManager) {
    this.device = device
    this.colors = colors

    this.device.on('ready', this.onReady.bind(this))
    this.device.on('padTouch', this.onTap.bind(this))
    this.device.on('controlChange', this.onControl.bind(this))
  }

  onColorChange = (pos: number, color: string) => {}

  onReady() {
    this.device.light(this.keymap.PLAY, 17)

    this.device.light(this.keymap.PREV, 33)
    this.device.light(this.keymap.NEXT, 33)
  }

  onTap(note: number) {
    let slot = toSlot(note)

    let color = this.scene[slot] || 0
    color = (color + 1) % this.palette.length

    this.scene[slot] = color
    this.colors.apply(slot, this.palette[color])
  }

  onControl(note: number, velocity: number) {
    if (velocity < 127) return

    let handler = this.controls[note]
    if (handler) handler.bind(this)()
  }

  render(scene = this.scene) {
    let specs = []

    for (let slot = 1; slot <= 64; slot++) {
      let cid = scene[slot]
      let color = this.palette[cid]
      if (!color) continue

      let {web, device} = this.colors.get(color)

      let spec = useTrait(toNote(slot), device)
      specs.push(spec)

      this.onColorChange(slot, web)
    }

    this.device.batch(specs)
  }

  updateScene() {
    let scene = this.frames[this.currentFrame]
    if (scene) this.scene = scene

    this.render()
  }

  timer?: NodeJS.Timeout
  fps = 10
  isPlaying = false

  play() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = undefined

      return
    }

    this.timer = setInterval(
      this.onTick.bind(this),
      Math.floor(1000 / this.fps),
    )
  }

  onTick() {
    this.currentFrame++
    if (this.currentFrame > this.frames.length) this.currentFrame = 0

    this.updateScene()
  }

  save() {
    this.frames[this.currentFrame] = [...this.scene]
  }

  go(offset: number = 1) {
    this.save()

    this.currentFrame += offset
    if (this.currentFrame < 0) this.currentFrame = this.frames.length - 1

    console.log('At frame', this.currentFrame, 'of', this.frames.length)

    this.updateScene()
  }

  next() {
    this.go(1)
  }

  prev() {
    this.go(-1)
  }

  load(frames: number[][]) {
    this.frames = frames
    this.currentFrame = 0

    this.updateScene()
  }

  clear() {
    this.scene = blank()
    this.device.fill(0)
  }
}
