import React from 'react'
import styled from '@emotion/styled'
import {useObserver} from 'mobx-react-lite'

import {useBoard} from '../store'

const Button = styled.button`
  width: 30px;
  height: 30px;
`

export function BoardInterface() {
  const board = useBoard()

  console.log('Use Board:', board)

  return useObserver(() => (<div>
    {board.uiScene.}
  </div>))
}
