import {types} from 'mobx-state-tree'

import {Board} from './board'
import {Keybind} from './keybind'

const {model, map} = types

export const App = model({
  board: Board,
  keybind: map(Keybind),
})
