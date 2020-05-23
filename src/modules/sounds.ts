import {Howl} from 'howler'

export type Sounds = Record<string, Howl>
export type SoundMapping = Record<string, SoundSource>

export interface SoundSource {
  src: string
  volume: number
}

interface HowlMeta {
  _src: string
  _volume: number
}

export class SoundManager {
  sounds: Sounds = {}

  onPlaybackEnd = (slot: number, sound: string) => {}

  add(name: string, src: string, config: Partial<IHowlProperties>) {
    let sound = new Howl({src, ...config})

    this.sounds[name] = sound
  }

  assign(slot: number, name: string) {
    let sound = this.sounds[name]
    if (!sound) return

    sound.on('end', () => this.onPlaybackEnd(slot, name))
  }

  play(name: string) {
    let sound = this.sounds[name]
    if (!sound) return

    if (sound.playing()) sound.stop()

    sound.play()
  }

  replace(mapping: SoundMapping) {
    for (let [name, sound] of Object.entries(mapping)) {
      this.add(name, sound.src, sound)
    }
  }

  toJS() {
    let sounds: SoundMapping = {}

    for (let [name, sound] of Object.entries(this.sounds)) {
      let {_src, _volume} = (sound as unknown) as HowlMeta

      sounds[name] = {src: _src, volume: _volume}
    }

    return sounds
  }
}
