import {DateTime, Settings} from 'luxon'

import {mockDate} from './utils'
import {getRemainingTime} from '../src/time-slot/get-remaining-time'

describe('Get remaining time', () => {
  beforeEach(() => {
    Settings.now = () => mockDate.valueOf()
  })

  it('should work', () => {
    const current = DateTime.fromISO('23:58')
    const remaining = getRemainingTime('23:55', current)

    expect(remaining).toBe('02:00')
  })

  it('should automatically derive current time', () => {
    const remaining = getRemainingTime('23:55')

    expect(remaining).toBe('02:00')
  })
})