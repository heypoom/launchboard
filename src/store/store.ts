import {types} from 'mobx-state-tree'

import {Board} from './board'

const {model} = types

export const Store = model({
  board: Board,
})
