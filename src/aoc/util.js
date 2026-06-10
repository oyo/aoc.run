import fs from 'fs'
import config from './config.js'

export const time = async (fn) => {
  const start = performance.now()
  const result = fn()
  const time = Math.round((performance.now() - start) * 10) / 10
  return { result, time }
}

export const exec1 = async (fn, input) => await time(() => fn(input))

export const execTestRun = async (fn, testdata, expect, input) => ({
  test: await (async (test) => ({
    ok: test.result == expect,
    ...test,
  }))(await exec1(fn, testdata)),
  run: input
    ? await (async (run) => ({
        ok: run.result !== -1,
        ...run,
      }))(await exec1(fn, input))
    : undefined,
})

export const exec = async (input, part1, part2) => ({
  part1: await time(() => part1(input)),
  part2: await time(() => part2(input)),
})

export const execAll = async (year, day, part1, part2, t, input) => ({
  year,
  day,
  part1: await execTestRun(part1, t.input ?? t.input1, t.expect1, input),
  part2: await execTestRun(part2, t.input ?? t.input2, t.expect2, input),
})

const streamToString = (stream) => {
  const chunks = []
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk))
    stream.on('error', reject)
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
  })
}

const getString = async (stream) => await streamToString(stream ?? process.stdin)

const aocDate = (year, day) => {
  const today = new Date()
  return {
    year: parseInt(year) ?? today.getFullYear(),
    day: parseInt(day) ?? today.getDate(),
  }
}

export const getURL = ({ year, day }) => `${config.BASE_API}/${year}/day/${day}`

export const getPath = ({ year, day }) => `${year}/${String(day).padStart(2, 0)}`

const downloadInput = async (aocdate) => {
  try {
    const url = `${getURL(aocdate)}/input`
    const response = await fetch(url)
    const input = await response.text()
    return input
  } catch (e) {
    return `ERROR: ${String(e)}`
  }
}

export const submitAnswer = async (year, day, level, output) => {
  try {
    const url = `${getURL({ year, day })}/answer`
    const body = `level=${level}&answer=${output}`
    const options = {
      method: 'POST',
      body,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    }
    const response = await fetch(url, options)
    const result = await response.text()
    return result
      .split('\n')
      .filter((l) => l.match(/<article>/))
      .join('')
      .replace(/<\/?[^>]+(>|$)/g, '')
  } catch (e) {
    return `ERROR: ${String(e)}`
  }
}

/*
const  copyStarter: async (day, year) => {
        const aocdate = util.getAoCDate(day, year)
        const path = util.getPath(aocdate)
        const filename = `${path}/puzzle.js`
        if (fs.existsSync(filename)) {
            return
        }
        await fs.promises.mkdir(path, { recursive: true })
        await fs.copyFile(`${__dirname}/puzzle.js_`, `${path}/puzzle.js`, err => { if (err) console.log(err) })
        await fs.copyFile(`${__dirname}/puzzle.test.js_`, `${path}/puzzle.test.js`, err => { if (err) console.log(err) })
    },
*/

const getInput = async (aocdate) => {
  const path = `public/data/${getPath(aocdate)}`
  const filename = `${path}/input`
  try {
    fs.existsSync(filename)
    const data = await getString(fs.createReadStream(filename))
    return data
  } catch (err) {
    const data = await downloadInput(aocdate)
    await fs.promises.mkdir(path, { recursive: true })
    fs.writeFile(filename, data, 'utf8', (err) => {
      if (err) console.log(err)
    })
    return data
  }
}
/*
const solve = async (aocdate, part, doSubmit) => {
  try {
    const date = getAoCDateFromPath(path)
    const input = await getInput(aocdate)
    const output = part(input)
    if (doSubmit) {
      const result = await submitAnswer(output, doSubmit, date)
      console.log(result)
    }
    return output
  } catch (e) {
    return `ERROR: ${e}`
  }
}
*/

export const run = async (year, day) => {
  const dayp = String(day).padStart(2, 0)
  const { part1, part2 } = await import(`../${year}/${dayp}/puzzle.js`)
  const t = (await import(`../${year}/${dayp}/testdata.js`)).default
  const input = await getInput({ year, day })
  return await execAll(year, day, part1, part2, t, input)
}

export const test = async (year, day) => {
  const dayp = String(day).padStart(2, 0)
  const { part1, part2 } = await import(`../${year}/${dayp}/puzzle.js`)
  const t = (await import(`../${year}/${dayp}/testdata.js`)).default
  return await execAll(year, day, part1, part2, t)
}
