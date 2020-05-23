import {getTimeSlots} from '../src/time-slot/get-time-slots'

describe('Get time slots', () => {
  it('should work for same-day', () => {
    const ts = getTimeSlots('04:00', '06:00')

    expect(ts.length).toBe(25)
    expect(ts[0]).toBeTruthy()

    expect(ts[1]).toBe('04:00')
    expect(ts[5]).toBe('04:20')
    expect(ts[ts.length - 1]).toBe('05:55')
  })

  it('should work across days', () => {
    const ts = getTimeSlots('23:00', '04:00')

    expect(ts.length > 20).toBeTruthy()
    expect(ts[1]).toBe('23:00')
    expect(ts[13]).toBe('00:00')
    expect(ts[ts.length - 1]).toBe('03:55')
  })
})