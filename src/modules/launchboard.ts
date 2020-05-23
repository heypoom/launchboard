import {SoundManager, SoundMapping} from './sounds'
import {ColorManager, ColorMapping} from './colors'

import {Launchpad} from '../launchpad'
import {toPos} from '../launchpad/conversion'
import {ControlCodes} from '../launchpad/controls'

export interface SlotConfig {
  color: string
  sound: string
}

export type SlotMapping = Record<number, SlotConfig>

export interface SaveConfig {
  slots: SlotMapping
  colors: ColorMapping
  sounds: SoundMapping
}

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

  // Initialize an instance of the sound manager.
  sounds = new SoundManager()

  constructor() {
    this.setup()
  }

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

      this.load()
    })

    this.sounds.onPlaybackEnd = slot => {
      let config = this.slots[slot]
      if (!config) return

      this.colors.apply(slot, config.color)
    }
  }

  onTap(note: number) {
    let pos = toPos(note)

    let slot = this.slots[pos]
    if (!slot) return

    this.colors.apply(pos, 'red')
    this.sounds.play(slot.sound)
  }

  setSlot(slot: number, config: SlotConfig) {
    this.slots[slot] = config

    if (config.color) this.colors.apply(slot, config.color)
    if (config.sound) this.sounds.assign(slot, config.sound)
  }

  add(
    slot: number,
    color: string,
    sound: string,
    options: Partial<SlotConfig>,
  ) {
    this.setSlot(slot, {color, sound, ...options})
  }

  save() {
    const saveConfig: SaveConfig = {
      slots: this.slots,
      colors: this.colors.toJS(),
      sounds: this.sounds.toJS(),
    }

    const config = JSON.stringify(saveConfig)
    localStorage.setItem(this.options.CONFIG_KEY, config)

    return config
  }

  load() {
    const saves = localStorage.getItem(this.options.CONFIG_KEY)
    if (!saves) return

    const config = JSON.parse(saves) as SaveConfig
    if (!config) return

    const {slots, colors, sounds} = config

    // Initializes the colors and sounds.
    if (colors) this.colors.replace(colors)
    if (sounds) this.sounds.replace(sounds)

    // Invoke setSlot for each slots to initialize their sounds and animations
    if (slots) {
      Object.entries(slots).forEach(([slot, config]) => {
        this.setSlot(Number(slot), config)
      })
    }
  }
}
