import { dropIn } from 'drop.that'
import { execAll } from './util.js'
import Config from './config.js'

export const getInput = async ({ year, day }) => {
  try {
    const response = await fetch(`data/${year}/${String(day).padStart(2, 0)}/input`)
    if (response.ok) throw new Error('not ok')
    const input = await response.text()
    if (input.startsWith('<!doctype html>')) throw new Error('not ok')
    return input
  } catch {
    return await (await fetch(`aoc/${year}/day/${day}/input`)).text()
  }
}

export const run = async (year, day) => {
  const context = location.host === 'localhost:4000' ? '..' : `${Config.BASE_UI}/src`
  const dayp = String(day).padStart(2, 0)
  const { part1, part2 } = await import(/* @vite-ignore */ `${context}/${year}/${dayp}/puzzle.js`)
  const t = (await import(/* @vite-ignore */ `${context}/${year}/${dayp}/testdata.js`)).default
  const input = await dropIn({
    apiIn: `/aoc/${year}/day/${day}/input`,
    autoStart: true,
  })
  return await execAll(year, day, part1, part2, t, input)
}

export const test = async (year, day) => {
  const context = location.host === 'localhost:4000' ? '..' : `${Config.BASE_UI}/src`
  const dayp = String(day).padStart(2, 0)
  const { part1, part2 } = await import(/* @vite-ignore */ `${context}/${year}/${dayp}/puzzle.js`)

  const t = (await import(/* @vite-ignore */ `${context}/${year}/${dayp}/testdata.js`)).default
  return await execAll(year, day, part1, part2, t)
}
