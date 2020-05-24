import {useContext} from 'react'
import {MobXProviderContext} from 'mobx-react'
import {unprotect} from 'mobx-state-tree'
import setInspectable from 'mobx-devtools-mst'

import {Store} from './store'

import {keybind} from '../constants/keybind'
import {colors} from '../constants/colors'

export const store = Store.create({
  board: {
    colors,
    keybind,
    slots: {},
    sounds: {},
    animations: {},
  },
})

export const useStores = () => useContext(MobXProviderContext)

unprotect(store)
setInspectable(store)

export const board = store.board
