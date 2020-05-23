// Events that we could listen for the launchpad.
export type DeviceEvents =
  | 'controlChange'
  | 'padTouch'
  | 'padRelease'
  | 'noteActive'
  | 'noteRelease'
  | 'update'
  | 'clear'
  | 'ready'

// Event handler for the launchpad events.
export type DeviceHandler = (note: number, velocity: number) => void

// Map of events to the event handlers.
export type DeviceListeners = Record<DeviceEvents, DeviceHandler[]>

// Grid to map between note value to pad position, and vice-versa.
export type MapperGrid = {[index: number]: number}
