import {DisplayTrait} from '../types/specs'

import {Launchpad} from '../launchpad'
import {Color} from '../launchpad/specs'
import {toNote} from '../launchpad/conversion'

export interface ColorConfig {
  web: string
  device: DisplayTrait
}

export type ColorMapping = Record<string, ColorConfig>

/**
 * ColorManager manages the colors to display in the launchpad and web interface.
 */
export class ColorManager {
  device: Launchpad
  colors: ColorMapping = {}

  constructor(device: Launchpad) {
    this.device = device
  }

  /**
   * This callback will be invoked when the color changes.
   */
  onColorChange = (pos: number, color: string) => {}

  /**
   * Gets the color name.
   *
   * @param name color name
   */
  get(name: string) {
    return this.colors[name]
  }

  /**
   * Adds a new color.
   *
   * @param name color name
   * @param web web color string. eg. #2d2d30, rgb(0, 0, 0)
   * @param trait color display trait - see the launchpad specs module.
   */
  add(name: string, web: string, trait: number | DisplayTrait) {
    let device = typeof trait === 'number' ? Color(trait) : trait
    let colorConfig = {web, device}

    this.colors[name] = colorConfig
  }

  /**
   * Applies the color at a specific button
   *
   * @param pos button position of the launchpad
   * @param color predefined color name
   */
  apply(pos: number, color: string) {
    let config = this.get(color)
    if (!config) return

    // Display the color on the device.
    this.device.display(toNote(pos), config.device)

    // Update the color on the web interface.
    this.onColorChange(pos, config.web)
  }

  replace(mapping: ColorMapping) {
    this.colors = mapping
  }

  toJS() {
    return this.colors
  }

  toString() {
    return JSON.stringify(this.colors)
  }
}
