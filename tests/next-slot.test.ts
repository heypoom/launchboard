import {getNextSlot} from '../src/time-slot/get-next-slot'

describe('Get next time-slot for 5-minute interval', () => {
  const expectations: {[index: string]: string} = {
    '23:58': '24:00',
    '12:50': '12:55',
    '17:00': '17:05',
    '24:00': '00:05',
  }

  it('should return the correct next time-slot', () => {
    for (let input in expectations) {
      const output = expectations[input]
      const slot = getNextSlot(input)

      expect(slot).toBe(output)
    }
  })
})