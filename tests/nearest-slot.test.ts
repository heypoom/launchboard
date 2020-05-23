import MockDate from 'mockdate'

import {mockDate} from './utils'
import {getNearestSlot} from '../src/time-slot/get-nearest-slot'

describe('Get nearest time-slot for 5-minute interval', () => {
  const expectations: {[index: string]: string} = {
    '23:44': '23:40',
    '23:48': '23:45',
    '23:40': '23:40',
  }

  beforeEach(() => {
    MockDate.set(mockDate)
  })

  it('should return the correct nearest time-slot', () => {
    for (let input in expectations) {
      const output = expectations[input]
      const slot = getNearestSlot(input)

      expect(slot).toBe(output)
    }
  })

  it('should be able to derive current time', () => {
    const slot = getNearestSlot()

    expect(slot).toBe('23:55')
  })
})