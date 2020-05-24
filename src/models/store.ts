import setInspectable from 'mobx-devtools-mst'

import {App} from './app'
import {Board} from './board'
import {Keybind} from './keybind'

export const store = App.create({
  keybind: {},
  board: {
    slots: {},
    colors: {},
    sounds: {},
    animations: {},
  },
})

setInspectable(store)
