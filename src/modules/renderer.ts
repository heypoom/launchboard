import {Launchpad} from '../launchpad'
import {useTrait} from '../launchpad/specs'
import {toNote} from '../launchpad/conversion'

import {Scene, Color} from '../types/animation'

export function renderScene(
  scene: Scene,
  palette: Color[],
  device: Launchpad,
): string[] {
  let specs = []
  let webScene = []

  for (let slot = 1; slot <= 64; slot++) {
    let cid = scene[slot]
    let color = palette[cid]
    if (!color) continue

    let {web, device} = color

    let spec = useTrait(toNote(slot), device)

    specs.push(spec)
    webScene.push(web)
  }

  device.batch(specs)

  return webScene
}

export function playAnimation(fps: number, tick: Function, timer?: number) {
  if (!timer) {
    timer = setInterval(tick, Math.floor(1000 / fps))
    return
  }

  clearInterval(timer)
  timer = undefined
}
