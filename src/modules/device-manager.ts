import {autorun} from 'mobx'

import {load} from './save-manager'
import {renderOnDevice} from './renderer'

import {Spec} from '../types/specs'
import {Launchpad} from '../launchpad'
import {BoardModel} from '../store/board'
import {toSlot} from '../launchpad/conversion'

/**
 * DeviceManager handles interaction events from the launchpad hardware.
 */
export class DeviceManager {
  board: BoardModel
  device: Launchpad

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
  }

  tap(note: number) {
    let slot = toSlot(note).toString()

    this.board.trigger(slot)
  }

  handleSceneChange() {
    renderOnDevice(this.board.scene, this.device)
  }

  setupControls() {
    this.board.keybind.forEach(btn => {
      this.device.display(btn.keyCode, btn.color.device as Spec)
    })
  }
}
