import {Howl} from 'howler'
import {onAction, ISerializedActionCall} from 'mobx-state-tree'

import {StoreModel} from '../store'

export type SoundCacheMap = Record<string, Howl>

export class SoundManager {
  store: StoreModel
  soundCache: SoundCacheMap = {}

  constructor(store: StoreModel) {
    this.store = store

    onAction(store, this.onStoreUpdate.bind(this))
  }

  onStoreUpdate(call: ISerializedActionCall) {
    if (!call.path?.startsWith('/board')) return

    switch (call.name) {
      case 'setupPlaybackEnd': {
        const [slot, sound, color] = call.args as [string, string, string]

        return this.onEnd(sound, () => this.store.board.setScene(slot, color))
      }

      case 'addSound': {
        const [name, src] = call.args as [string, string]

        return this.load(name, {src})
      }

      case 'play': {
        const match = call.path?.match('/sounds/(.*)')
        if (!match) return

        const [_, sound] = match
        this.play(sound)
      }
    }
  }

  load(name: string, config: IHowlProperties) {
    if (this.soundCache[name]) return

    let sound = new Howl(config)
    this.soundCache[name] = sound
  }

  onEnd(name: string, onEnd: Function) {
    let sound = this.soundCache[name]
    if (!sound) return

    sound.off()
    sound.on('end', onEnd)
  }

  play(name: string) {
    let sound = this.soundCache[name]
    if (!sound) return

    if (sound.playing()) sound.stop()

    sound.play()
  }
}
