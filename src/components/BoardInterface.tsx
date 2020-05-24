import React from 'react'
import {useObserver} from 'mobx-react-lite'

import {useBoard} from '../store'

export function BoardInterface() {
  const board = useBoard()

  console.log('Use Board:', board)

  return useObserver(() => <div>Hello!</div>)
}
