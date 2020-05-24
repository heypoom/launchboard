import {ControlCodes} from '../launchpad/controls'

export const keybind = {
  play: {
    name: 'play',
    keyCode: ControlCodes.VOLUME,
    color: 'green',
  },
  prev: {
    name: 'prev',
    keyCode: ControlCodes.LEFT,
    color: 'blue',
  },
  next: {
    name: 'next',
    keyCode: ControlCodes.RIGHT,
    color: 'blue',
  },
}
