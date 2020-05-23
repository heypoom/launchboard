import React from 'react'
import styled from '@emotion/styled'

import {Launchpad} from '../launchpad/device'

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

let device = new Launchpad()
window.device = device

export function App() {
  return <Container>Launchpad Controller.</Container>
}
