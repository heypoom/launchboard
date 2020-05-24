import {Color, RGB} from '../launchpad/specs'

export const colors = {
  green: {
    name: 'green',
    ui: 'green',
    device: Color(25),
  },
  red: {
    name: 'red',
    ui: '#e74c3c',
    device: Color(60),
  },
  purple: {
    name: 'purple',
    ui: 'purple',
    device: Color(49),
  },
  pink: {
    name: 'pink',
    ui: '#ff7ef8',
    device: RGB(127, 0, 29),
  },
  blue: {
    name: 'blue',
    ui: '#01dcfc',
    device: RGB(0, 127, 119),
  },
  yellow: {
    name: 'yellow',
    ui: '#f1c40f',
    device: RGB(127, 72, 0),
  },
  none: {
    name: 'none',
    ui: '',
    device: Color(0),
  },
}
