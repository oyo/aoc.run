import { expect, test } from 'vite-plus/test'
import { checkIntersect } from './puzzle'

test('calculates intersections', () => {
  expect(checkIntersect([1, 1], [4, 4], [2, 2], [2, 5])).toEqual(true)
  expect(checkIntersect([1, 1], [4, 4], [5, 2], [2, 2])).toEqual(true)
  expect(checkIntersect([1, 1], [4, 4], [3, 0], [3, 5])).toEqual(true)
  expect(checkIntersect([1, 1], [4, 4], [2, 2], [3, 3])).toEqual(true)
  expect(checkIntersect([1, 1], [4, 4], [0, 0], [0, 5])).toEqual(false)
  expect(checkIntersect([1, 1], [4, 4], [0, 0], [5, 0])).toEqual(false)
})
