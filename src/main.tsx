import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import Reactotron from 'reactotron-react-js'

import './modules/reactotron'

import {App} from './app'
import {store} from './store'

import {device} from './launchpad'

import {control} from './modules/device-manager'
import {save, load} from './modules/save-manager'

window.store = store
window.board = store.board
window.device = device
window.control = control
window.save = save
window.load = load

Reactotron.trackMstNode?.(store)

ReactDOM.render(<App />, document.querySelector('#app'))
