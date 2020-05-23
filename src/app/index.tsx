import React from 'react'
import styled from '@emotion/styled'

import {Launchboard} from '../modules/launchboard'

const Container = styled.div`
  display: grid;
  min-height: 100vh;
  width: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;

  color: #2d2d30;
  background: #f1f3f5;
`

let board = new Launchboard()

window.board = board
window.device = board.device
window.sounds = board.sounds
window.colors = board.colors
window.animator = board.animator

export function App() {
  return <Container>Launchpad Controller.</Container>
}
