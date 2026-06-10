import { dropIn } from 'drop.that'
import { exec } from './util.js'

export const puzzle = async (year, day) => {
  const dayp = String(day).padStart(2, 0)
  const { part1, part2 } = await import(`../${year}/${dayp}/puzzle`)
  const input = await dropIn({
    apiIn: `aoc/${year}/day/${day}/input`,
    autoStart: true,
  })
  return {
    year,
    day,
    ...(await exec(input, part1, part2)),
  }
}
