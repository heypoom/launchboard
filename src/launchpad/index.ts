import {Input, Output} from 'webmidi'

import {toNote, toSlot} from './conversion'
import {ControlCodes} from './controls'
import {enableMidiWithSysEx, inputOf, outputOf} from './midi'

import {
  Color,
  Flash,
  Pulse,
  RGB,
  buildSpecFromGrid,
  buildFillGrid,
  useTrait,
} from './specs'

import {DisplayTrait, Spec, InputGrid} from '../types/specs'
import {DeviceHandler, DeviceListeners} from '../types/midi'

export class Launchpad {
  // Interface for the 64-button pressure-sensitive areas
  midiIn?: Input
  midiOut?: Output

  // Interface for the 16 control buttons.
  dawIn?: Input
  dawOut?: Output

  // MIDI interface name for the MIDI device
  midiInName = 'Launchpad X LPX MIDI Out'
  midiOutName = 'Launchpad X LPX MIDI In'

  // MIDI interface name for the DAW device
  dawInName = 'Launchpad X LPX DAW Out'
  dawOutName = 'Launchpad X LPX DAW In'

  // Has the launchpad module been initialized?
  initialized = false

  // Convert between note value and button position.
  toNote = toNote
  toSlot = toSlot

  // Building blocks for grid payload.
  Color = Color
  Flash = Flash
  Pulse = Pulse
  RGB = RGB

  // Note values for the control buttons
  ControlCodes = ControlCodes

  /**
   * Event listeners for the launchpad.
   */
  listeners: DeviceListeners = {
    controlChange: [],
    padTouch: [],
    padRelease: [],
    noteActive: [],
    noteRelease: [],
    update: [],
    clear: [],
    ready: [],
  }

  constructor() {
    this.setup()
  }

  /**
   * Setup the launchpad device.
   */
  async setup() {
    if (this.initialized) return

    await enableMidiWithSysEx()
    this.initPorts()
    this.setupListeners()
    this.useProgrammerLayout()
    this.dispatch('ready')

    this.initialized = true
  }

  /**
   * Initializes the MIDI ports for the launchpad.
   */
  initPorts() {
    this.midiIn = inputOf(this.midiInName)
    this.midiOut = outputOf(this.midiOutName)
    this.dawIn = inputOf(this.dawInName)
    this.dawOut = outputOf(this.dawOutName)
  }

  /**
   * Adds an event listener to the launchpad.
   *
   * @param event name of the event
   * @param handler callback to invoke when the event occurs.
   */
  on(event: keyof DeviceListeners, handler: DeviceHandler) {
    if (!this.listeners[event]) return

    this.listeners[event].push(handler)
  }

  /**
   * Dispatch the event.
   *
   * @param event
   * @param note
   * @param velocity
   */
  dispatch(
    event: keyof DeviceListeners,
    note: number = 0,
    velocity: number = 0,
  ) {
    if (!this.listeners[event]) return

    console.debug(`${event}>`, note, velocity)

    // When the event is dispatched, invoke the event listeners.
    for (let listener of this.listeners[event]) {
      listener(note, velocity)
    }
  }

  /**
   * Initializes the MIDI port event listeners.
   */
  setupListeners() {
    if (!this.midiIn) return
    if (!this.dawIn) return

    this.midiIn.addListener('noteon', 'all', event => {
      this.dispatch('padTouch', event.note.number, event.rawVelocity)
    })

    this.midiIn.addListener('noteoff', 'all', event => {
      this.dispatch('padRelease', event.note.number, event.rawVelocity)
    })

    this.dawIn.addListener('noteon', 'all', event => {
      let note = event.note.number
      this.dispatch('noteActive', note, event.rawVelocity)
    })

    this.dawIn.addListener('noteoff', 'all', event => {
      let note = event.note.number
      this.dispatch('noteRelease', note, event.rawVelocity)
    })

    this.midiIn.addListener('controlchange', 'all', event => {
      const {value, controller} = event
      const id = controller.number

      this.dispatch('controlChange', id, value)
    })
  }

  /**
   * Activates the programmer layout on the launchpad.
   */
  useProgrammerLayout() {
    this.cmd(0, 127)
    this.cmd(14, 1)
  }

  /**
   * Sends a data payload via the SysEx interface.
   *
   * @param data the data payload array (value should be between 0-255)
   */
  cmd(...data: number[]) {
    if (!this.dawOut) return

    this.dawOut.send(240, [0, 32, 41, 2, 12, ...data, 247])
  }

  /**
   * Alternates between 2 colors.
   *
   * @param n note value
   * @param a first color
   * @param b second color
   */
  flash(n: number, a: number, b: number) {
    this.display(n, Flash(a, b))
  }

  /**
   * Displays the RGB colors. Each note value should be between 0 - 127.
   *
   * @param n note value
   * @param r red value (0 - 127)
   * @param g green value (0 - 127)
   * @param b blue (0 - 127)
   */
  rgb(n: number, r: number, g: number, b: number) {
    this.display(n, RGB(r, g, b))
  }

  /**
   * Pulse the colors rapidly.
   *
   * @param n
   * @param color
   */
  pulse(n: number, color: number) {
    this.display(n, Pulse(color))
  }

  /**
   * Transforms the specs into data payload, and sends it.
   *
   * @param specs
   */
  batch(specs: Spec[]) {
    let payload: number[] = []
    for (let spec of specs) payload = [...payload, ...spec]

    this.cmd(3, ...payload)
  }

  /**
   * Display the display trait
   *
   * @param note
   * @param trait
   */
  display(note: number, trait: DisplayTrait) {
    this.batch([useTrait(note, trait)])
  }

  /**
   * Lights up the pad with the specified solid color.
   *
   * @param note the note position on the launchpad
   * @param color the color number between 0 - 127
   */
  light(note: number, color: number) {
    if (!this.midiOut) return

    this.dispatch('update', note, color)

    this.midiOut.playNote(note, 1, {
      velocity: color,
      rawVelocity: true,
    })
  }

  grid(grid: InputGrid) {
    this.batch(buildSpecFromGrid(grid))
  }

  /**
   * Fills every pad with the specified color.
   */
  fill(color: number | Spec = 0) {
    this.grid(buildFillGrid(color))
  }
}
