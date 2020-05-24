import React from 'react'
import styled from '@emotion/styled'

import {BoardInterface} from './BoardInterface'

import {StoreContext} from '../store'
import {createServices} from '../modules/services'

const Container = styled.div`
  display: grid;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;

  color: #f1f3f5;
  background: #161516;
`

const {Provider} = StoreContext

const {store, device, deviceManager, soundManager} = createServices()

export function App() {
  return (
    <Provider value={store}>
      <Container>
        <BoardInterface />
      </Container>
    </Provider>
  )
}
