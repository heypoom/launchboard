import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import {App} from './app'
import {store} from './models/store'

import {device} from './launchpad'

window.store = store
window.device = device

ReactDOM.render(<App />, document.querySelector('#app'))
