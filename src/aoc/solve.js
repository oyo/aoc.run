import { run, submitAnswer } from './util.js'
import Config from './config.js'

const printUsageAndExit = () => {
  console.log(`format: node src/aoc/solve <year> [0|<day>] [0|1|2]`)
  process.exit(1)
}

const readArgs = (a) => {
  let year, day, submit
  if (a.length < 1 || a.length > 3) printUsageAndExit()

  try {
    year = parseInt(a[0])
  } catch (e) {
    printUsageAndExit()
  }
  if (!Object.keys(Config.PUZZLES).includes(String(year))) printUsageAndExit()

  try {
    day = parseInt(a[1])
  } catch (e) {
    day = -1
  }
  if (day < 0 || day > Config.PUZZLES[year]) printUsageAndExit()

  try {
    submit = parseInt(a[2])
  } catch (e) {
    submit = -1
  }
  if (submit < 0 || submit > 2) printUsageAndExit()

  return {
    year,
    day,
    submit,
  }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const R = '\x1b[0m'
const color = (code) => `\x1b[38;5;${code}m`
const timeCode = (ms) => [32, 10, 118, 11, 208, 124, 9][String(ms).length]
const tc = (t) => `${color(timeCode(t))}${String(t).padStart(5)} ms${R}`
const test = (v) => `${color(v ? 10 : 9)} ${String(v).padStart(5)} ${R}`
const val = (v) => `${color(v === -1 ? 9 : 15)} ${String(v).padStart(16)} ${R}`
const print = (part) => `${test(part.test.ok)} ${tc(part.run.time * 10)} ${val(part.run.result)}`
const answer = (m) => `${color(11)}${m}${R}`

const solve = async (year, day, submit) => {
  if (day) {
    const r = await run(year, day)
    console.log(`${year}-${String(day).padStart(2, 0)} ${print(r.part1)} ${print(r.part2)}`)
    if (submit > 0) {
      const value = submit === 2 ? r.part2.run.result : r.part1.run.result
      console.log(`submit part ${submit}: ${val(value)}`)
      const output = await submitAnswer(year, day, submit, value)
      console.log(answer(output))
    }
    return
  }
  const days = new Array(Config.PUZZLES[year]).fill(0).map((_, i) => i + 1)
  for (const day of days) {
    await solve(year, day)
    await delay(10)
  }
}

const { year, day, submit } = readArgs(process.argv.slice(2))
void solve(year, day, submit)
