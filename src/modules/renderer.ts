import {Launchpad} from '../launchpad'
import {useTrait} from '../launchpad/specs'
import {toNote} from '../launchpad/conversion'

import {Color} from '../types/animation'

export function renderOnDevice(scene: Color[], device: Launchpad): string[] {
  let specs = []

  for (let slot = 1; slot <= 64; slot++) {
    let color = scene[slot]
    if (!color) continue

    let {device} = color

    let spec = useTrait(toNote(slot), device)

    specs.push(spec)
  }

  device.batch(specs)
}

export function playAnimation(fps: number, tick: Function, timer?: number) {
  if (!timer) {
    timer = setInterval(tick, Math.floor(1000 / fps))
    return
  }

  clearInterval(timer)
  timer = undefined
}
