import {range} from './utils'

import {Spec, InputGrid} from '../types/specs'

/**
 * Specs are used for sending light change events
 * in bulk to the launchpad.
 */

// Specs for fixed-color lights.
// prettier-ignore
export const ColorSpec = (note: number, color: number): Spec =>
  [0, note % 99, color % 128]

// Specs for flashing lights.
// prettier-ignore
export const FlashSpec = (note: number, A: number, B: number): Spec =>
  [1, note % 99, A % 128, B % 128]

// Specs for pulsing lights.
// prettier-ignore
export const PulseSpec = (note: number, color: number): Spec =>
  [2, note % 99, color % 128]

// Specs for RGB lights.
// prettier-ignore
export const RGBSpec = (note: number, r: number, g: number, b: number): Spec =>
  [3, note % 99, r % 128, g % 128, b % 128]

/**
 * Builds the midi grid.
 *
 * This is used for building the payload from the spec.
 */
export function buildMidiGrid(): number[][] {
  let midiGrid = []

  for (let i = 8; i >= 1; i--) {
    const b = i * 10
    midiGrid.push(range(b + 1, b + 8))
  }

  return midiGrid
}

export const midiGrid = buildMidiGrid()

function convertToSpec(note: number, spec: Spec): Spec {
  let type = spec.slice(0, 1)
  let options = spec.slice(1)

  return [...type, note, ...options] as Spec
}

export function buildSpecFromGrid(grid: InputGrid): Spec[] {
  const specs: Spec[] = []

  for (let row in grid) {
    for (let col in grid[row]) {
      let x = Number(col)
      let y = Number(row)

      let input = grid[y][x]
      const note = midiGrid[y][x]

      // If input is a number, parse as a simple color.
      // Otherwise, use the specified input as spec.
      if (typeof input === 'number') {
        specs.push(ColorSpec(note, input))
      } else if (Array.isArray(input)) {
        specs.push(convertToSpec(note, input))
      }
    }
  }

  return specs
}

/**
 * Builds a grid to fill the launchpad with a single color.
 * Used mostly for clearing the launchpad.
 *
 * @param spec color spec or color number
 */
export const buildFillGrid = (spec: number | Spec = 0) =>
  range(0, 8).map(() => range(0, 8).map(() => spec))
