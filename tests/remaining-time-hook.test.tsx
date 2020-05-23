import React from 'react'
import MockDate from 'mockdate'
import {render, getByTestId, cleanup} from 'react-testing-library'

import {useRemainingTime} from '../src/time-slot/use-remaining-time'

const RemainingTime = (props: {timeSlot: string}) => {
  const remainingTime = useRemainingTime(props.timeSlot)

  return <>{remainingTime}</>
}

describe('Remaining time hook', () => {
  jest.useFakeTimers()

  it('should display the remaining time in current slot', () => {
    MockDate.set(new Date(2019, 5, 20, 23, 47, 30))

    const {container} = render(<RemainingTime timeSlot="23:45" />)

    const node = container.firstChild
    expect(node).toBeDefined()

    jest.advanceTimersByTime(1000)

    if (node) {
      expect(node.textContent).toBe('02:30')
    }
  })
})
