import { glob } from 'glob'

const days = {
  2015: 25,
  2016: 25,
  2017: 25,
  2018: 25,
  2019: 25,
  2020: 25,
  2021: 25,
  2022: 25,
  2023: 25,
  2024: 25,
  2025: 12,
}

const find = async (path) =>
  (await glob(path))
    .map((s) => s.split('/').slice(1, 3).map(Number))
    .sort((a, b) => 100 * a[0] + a[1] - (100 * b[0] + b[1]))
    .reduce((a, c) => {
      const y = c[0]
      const d = c[1]
      if (!a[y]) a[y] = [d]
      else a[y].push(d)
      return a
    }, {})

const puzzle = await find('src/**/puzzle.js')
const visual = await find('src/**/visual.js')

console.log(JSON.stringify({ puzzle, visual }))
