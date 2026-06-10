import { expect, test } from 'vite-plus/test'
import { valid, part1, part2 } from './puzzle'
import t from './testdata'
test('input 1 valid', () => expect(valid(t.input1)).toBe(true))
test('input 2 valid', () => expect(valid(t.input2)).toBe(true))
test('solves part 1', () => expect(part1(t.input1)).toBe(t.expect1))
test('solves part 2', () => expect(part2(t.input2)).toBe(t.expect2))
