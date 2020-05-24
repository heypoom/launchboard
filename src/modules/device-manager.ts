import {autorun} from 'mobx'

import {load} from './save-manager'
import {renderOnDevice} from './renderer'

import {Spec} from '../types/specs'
import {BoardModel} from '../store/board'

import {Launchpad} from '../launchpad'
import {toSlot} from '../launchpad/conversion'

/**
 * DeviceManager handles interaction events from the launchpad hardware.
 */
export class DeviceManager {
  board: BoardModel
  device: Launchpad

  actions: Record<string, Function> = {
    play: () => this.board.playAnimation(),
    next: () => this.board.nextFrame(),
    prev: () => this.board.prevFrame(),
  }

  keyCodeCache = new Map<number, string>()

  constructor(device: Launchpad, board: BoardModel) {
    this.device = device
    this.board = board

    device.on('ready', () => {
      device.fill(0)

      autorun(this.setupControls.bind(this))
      autorun(this.handleSceneChange.bind(this))

      load(board)
    })

    device.on('padTouch', this.tap.bind(this))
    device.on('controlChange', this.onControlChange.bind(this))
  }

  tap(note: number) {
    let slot = toSlot(note).toString()

    this.board.trigger(slot)
  }

  onControlChange(note: number, velocity: number) {
    if (velocity === 0) return

    let action = this.keyCodeCache.get(note)
    if (!action) return

    let handler = this.actions[action]
    if (handler) handler()
  }

  handleSceneChange() {
    renderOnDevice(this.board.scene, this.device)
  }

  setupControls() {
    this.keyCodeCache.clear()

    this.board.keybind.forEach(btn => {
      this.device.display(btn.keyCode, btn.color.device as Spec)

      this.keyCodeCache.set(btn.keyCode, btn.name)
    })
  }
}
