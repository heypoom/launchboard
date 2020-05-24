import {range} from '../launchpad/utils'

export const blankScene = range(0, 63).map(() => 'none')

export const animations = {
  default: {
    name: 'default',
    fps: 10,
    palette: ['none', 'blue', 'pink', 'yellow'],
    frames: [blankScene],
  },
}
