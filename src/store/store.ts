import {types} from 'mobx-state-tree'

import {Board} from './board'
import {save, load} from '../modules/save-manager'

const {model} = types

export const Store = model({
  board: Board,
})
