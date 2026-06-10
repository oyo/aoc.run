import { expect, test } from 'vite-plus/test'
import { valid, part1, part2 } from './puzzle'
import t from './testdata'
test('input valid', () => expect(valid(t.input)).toBe(true))
test('solves part 1', () => expect(part1(t.input)).toBe(t.expect1))
test('solves part 2', () => expect(part2(t.input)).toBe(t.expect2))
