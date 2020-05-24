import {Howl} from 'howler'

export type SoundCacheMap = Record<string, Howl>

export class SoundManager {
  sounds: SoundCacheMap = {}

  load(name: string, config: IHowlProperties) {
    if (this.sounds[name]) return

    let sound = new Howl(config)
    this.sounds[name] = sound
  }

  onEnd(name: string, onEnd: Function) {
    let sound = this.sounds[name]
    if (!sound) return

    sound.off()
    sound.on('end', onEnd)
  }

  play(name: string) {
    let sound = this.sounds[name]
    if (!sound) return

    if (sound.playing()) sound.stop()

    sound.play()
  }
}

export const soundManager = new SoundManager()
window.sound = soundManager
