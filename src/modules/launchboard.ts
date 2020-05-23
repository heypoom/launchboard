import {Launchpad} from '../launchpad'
import {ControlCodes} from '../launchpad/control-buttons'

import {ColorManager} from '../modules/colors'

export interface SlotConfig {
  color: string
  sound: string
}

export type SlotMapping = Record<number, SlotConfig>

export class Launchboard {
  // Control key bindings for the launchpad.
  keymap = {
    RESET: ControlCodes.RECORD_ARM,
  }

  // Options for the launchboard.
  options = {
    CONFIG_KEY: 'launchboard.config',
  }

  // Slots to place the sound.
  slots: SlotMapping = {}

  // Initialize an instance of the Launchpad controller.
  device = new Launchpad()

  // Initialize an instance of the color manager.
  colors = new ColorManager(this.device)

  /**
   * Event listener for when the light changes.
   * Override this.
   *
   * @param position position of the button (1 - 64)
   * @param color color of the button in hex
   */
  onLightChange = (position: number, color: string) => {}

  async setup() {
    this.device.on('ready', () => {
      this.device.fill()
      this.device.on('padTouch', this.onTap.bind(this))
    })
  }

  onTap(note: number, velocity: number) {}

  setSlot(slot: number, config: SlotConfig) {
    this.slots[slot] = config
  }

  save() {
    const config = JSON.stringify(this.slots)
    localStorage.setItem(this.options.CONFIG_KEY, config)

    return config
  }

  load() {
    const saves = localStorage.getItem(this.options.CONFIG_KEY)
    if (!saves) return

    this.slots = JSON.parse(saves)

    // Invoke setSlot for each slots to initialize their sounds and animations
    Object.entries(this.slots).forEach(([slot, config]) => {
      this.setSlot(Number(slot), config)
    })
  }
}
