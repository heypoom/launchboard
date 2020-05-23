import WebMidi from 'webmidi'

/**
 * Enables the MIDI interface with SysEx command support.
 */
export const enableMidiWithSysEx = () =>
  new Promise((resolve, reject) => {
    WebMidi.enable(err => {
      if (err) return reject(err)
      resolve()
    }, true)
  })

export function inputOf(name: string) {
  const inPort = WebMidi.getInputByName(name)
  if (inPort) return inPort
}

export function outputOf(name: string) {
  const outPort = WebMidi.getOutputByName(name)
  if (outPort) return outPort
}
