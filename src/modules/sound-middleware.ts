import {IMiddlewareHandler} from 'mobx-state-tree'

import {BoardModel} from '../store/board'
import {SoundManager} from './sound-manager'

export function SoundMiddleware(
  manager: SoundManager,
  board: BoardModel,
): IMiddlewareHandler {
  function setupSlot(slot: string) {
    let config = board.getSlot(slot)
    if (!config) return

    let {sound, color} = config
    if (!sound) return

    manager.onEnd(sound.name, () => {
      if (!color) return

      board.setScene(slot, color.name)
    })
  }

  const playSound = (sound: string) => manager.play(sound)
  const addSound = (name: string, src: string) => manager.load(name, {src})

  const handlers: Record<string, Function> = {setupSlot, playSound, addSound}

  return function middleware(call, next, abort) {
    const handler = handlers[call.name]
    if (handler) handler(...call.args)

    next(call, value => value)
  }
}
