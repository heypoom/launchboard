import {types} from 'mobx-state-tree'

import {Color} from './color'

const {model, number, identifier, reference} = types

export let Keybind = model({
  name: identifier,
  keyCode: number,
  color: reference(Color),
})
