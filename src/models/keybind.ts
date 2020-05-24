import {types} from 'mobx-state-tree'

const {model, number, identifier} = types

export const Keybind = model({
  name: identifier,
  keyCode: number,
  light: number,
})
