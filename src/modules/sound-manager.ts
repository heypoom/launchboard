import {Howl} from 'howler'

import {StoreModel} from '../store'

export type SoundCacheMap = Record<string, Howl>

export class SoundManager {
  store: StoreModel
  soundCache: SoundCacheMap = {}

  constructor(store: StoreModel) {
    this.store = store
  }

  load(name: string, config: IHowlProperties) {
    if (this.soundCache[name]) return

    let sound = new Howl(config)
    this.soundCache[name] = sound
  }

  onEnd(name: string, onEnd: Function) {
    let sound = this.soundCache[name]
    if (!sound) return

    sound.on('end', onEnd)
  }

  play(name: string) {
    let sound = this.soundCache[name]
    if (!sound) return

    if (sound.playing()) sound.stop()

    sound.play()
  }
}
