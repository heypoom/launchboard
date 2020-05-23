type ID = number
type Note = number

// Types for the launchpad display trait.
export type Color = [ID, number]
export type Flash = [ID, number, number]
export type RGB = [ID, number, number, number]

// Types for the launchpad display spec.
export type ColorSpec = [ID, Note, number]
export type FlashSpec = [ID, Note, number, number]
export type RGBSpec = [ID, Note, number, number, number]

// Types for every possible launchpad specs.
export type DisplayTrait = Color | Flash | RGB
export type Spec = ColorSpec | FlashSpec | RGBSpec

// Types for the input grid.
export type InputGridElement = number | Spec
export type InputGrid = InputGridElement[][]
