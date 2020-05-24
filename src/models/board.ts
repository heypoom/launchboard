import {types} from 'mobx-state-tree'

import {Slot} from './slot'
import {Color, newColor} from './color'
import {Sound} from './sound'
import {Animation} from './animation'

const {model, map} = types

/**
 * Board defines the save state of the entire board.
 */
export let Board = model('Board', {
  slots: map(Slot),
  colors: map(Color),
  sounds: map(Sound),
  animations: map(Animation),
})

Board = Board.actions(self => ({
  addColor(name: string, web: string, deviceSpec: number[]) {
    self.colors.put(newColor(name, web, deviceSpec))
  },
}))
