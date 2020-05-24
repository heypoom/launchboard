import {Howl} from 'howler'

export type SoundCacheMap = Record<string, Howl>

export class SoundManager {
  sounds: SoundCacheMap = {}

  onPlaybackEnd = (slot: number, sound: string) => {}

  set(name: string, config: IHowlProperties) {
    let sound = new Howl(config)
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
}
