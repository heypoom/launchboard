/**
 * Types for each launchpad specs.
 * @see specs.ts
 */

export type ColorSpecT = [number, number, number]
export type FlashSpecT = [number, number, number, number]
export type RGBSpecT = [number, number, number, number, number]

// Types for every possible launchpad specs.
export type Spec = ColorSpecT | FlashSpecT | RGBSpecT

// Types for the input grid.
export type InputGridElement = number | Spec
export type InputGrid = InputGridElement[][]
