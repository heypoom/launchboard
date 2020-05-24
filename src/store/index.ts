import {createContext, useContext} from 'react'
import {Instance, SnapshotIn} from 'mobx-state-tree'
import setInspectable from 'mobx-devtools-mst'
import Reactotron from 'reactotron-react-js'

import '../modules/reactotron'

import {Store} from './store'

import {keybind} from '../constants/keybind'
import {colors} from '../constants/colors'

export type StoreState = SnapshotIn<typeof Store>
export type StoreModel = Instance<typeof Store>

let initialState: StoreState = {
  board: {
    colors,
    keybind,
    slots: {},
    sounds: {},
    animations: {},
  },
}

export function createStore() {
  let store = Store.create(initialState)

  Reactotron.trackMstNode?.(store)
  setInspectable(store)

  return store
}

export const StoreContext = createContext<StoreModel>({} as StoreModel)

export const useStore = () => useContext(StoreContext)

export function useBoard() {
  const store = useStore()

  return store.board
}
