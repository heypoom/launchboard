import {autorun} from 'mobx'

import {load} from './save-manager'
import {renderScene} from './renderer'

import {store} from '../store'
import {Spec} from '../types/specs'
import {device} from '../launchpad'
import {toSlot} from '../launchpad/conversion'

const board = store.board

export class DeviceManager {
  constructor() {
    device.on('ready', () => {
      device.fill(0)

      autorun(this.setupControls.bind(this))
      autorun(this.handleSceneChange.bind(this))

      load()
    })

    device.on('padTouch', this.tap.bind(this))
  }

  tap(note: number) {
    let slot = toSlot(note).toString()

    board.trigger(slot)
  }

  handleSceneChange() {
    renderScene(board.scene, device)
  }

  setupControls() {
    board.keybind.forEach(btn => {
      device.display(btn.keyCode, btn.color.device as Spec)
    })
  }
}

export const control = new DeviceManager()
