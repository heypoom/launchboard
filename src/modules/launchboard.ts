import {Launchpad} from '../launchpad'
import {ControlCodes} from '../launchpad/control-buttons'

interface SlotConfig {
  color: string
  sound: string
  loop?: boolean
  solo?: boolean
  parallel?: boolean
}

export type SlotMapping = Record<number, SlotConfig>

export class Launchboard {
  // Control key bindings for the launchpad.
  keymap = {
    RESET: ControlCodes.RECORD_ARM,
  }

  // Options for the soundboard
  options = {
    SLOTS_SAVE_KEY: 'launchboard.slots',
  }

  // Slots to place the sound.
  slots: SlotMapping = {}

  device = new Launchpad()

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

  setSlot(slot: number, config: SlotConfig) {}

  save() {
    const config = JSON.stringify(this.slots)
    localStorage.setItem(this.options.SLOTS_SAVE_KEY, config)

    return config
  }

  load() {
    const saves = localStorage.getItem('soundboard.config')
    if (!saves) return

    this.slots = JSON.parse(saves)

    // Invoke setSlot for each slots to initialize their sounds and animations
    Object.entries(this.slots).forEach(([slot, config]) => {
      this.setSlot(Number(slot), config)
    })
  }
}
