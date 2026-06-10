import './style.css'
import Config from '../../aoc/config.js'
import { Viewable, N, addEvents, clear } from '../../aoc/ui.js'
import { submitAnswer } from '../../aoc/util.js'
import { run, test } from '../../aoc/utilBrowser.js'
import { WaitCommand } from './WaitCommand.js'
import { VisualView } from '../Visualization/index.js'

const USAGE = `available:

  help
  clear
  check
  input
  test
  run
  viz

`

export class TerminalView extends Viewable {
  constructor() {
    super()
    this.meta = fetch('data/meta.json')
      .then((response) => response.json())
      .then(((meta) => (this.meta = meta)).bind(this))
    this.history = []
    this.histPtr = 0
    this.view = N(
      'div',
      [
        (this.output = N('div', null, { class: 'output' })),
        N(
          'span',
          [
            '$',
            (this.command = addEvents(N('input', null, { class: 'command' }), {
              keyup: this.keyHandler.bind(this),
            })),
          ],
          { class: 'commandline' },
        ),
      ],
      { class: 'terminal' },
    )
    setTimeout(this.command.focus.bind(this.command), 100)
  }

  async execute(cmd) {
    this.command.value = cmd
    await this.keyHandler({
      keyCode: 13,
      target: this.command,
    })
    return this
  }

  print(output) {
    this.output.appendChild(N('pre', output))
    window.scrollTo(0, document.body.scrollHeight)
  }

  async check() {
    const inp = await (await fetch(`/aoc/${2015}/day/${1}/input`)).text()
    this.print(inp)
    this.print(
      /^[()]+$/.exec(inp)
        ? N('span', '✅ input looks fine', { class: 'test ok' })
        : N('span', '❌ unable to read input through proxy server', {
            class: 'test nok',
          }),
    )
  }

  async input(year, day) {
    if (
      !year ||
      day < 1 ||
      !Object.keys(Config.PUZZLES).includes(year) ||
      day > Object.keys(Config.PUZZLES)[year]
    ) {
      this.print(
        `input <year> <day>\n\navailable:\n${Object.keys(Config.PUZZLES)
          .sort((a, b) => a - b)
          .map((y) => `  ${y} 1-${Config.PUZZLES[y]}`)
          .flat()
          .join('\n')}`,
      )
      return
    }
    const inp = await (await fetch(`/aoc/${year}/day/${day}/input`)).text()
    this.print(inp)
  }

  async viz(year, day) {
    const sy = String(year)
    if (
      !year ||
      !day ||
      !Object.keys(this.meta.visual).includes(sy) ||
      !this.meta.visual[sy].includes(day)
    ) {
      this.print(
        `viz <year> <day>\n\navailable:\n${Object.keys(this.meta.visual)
          .sort((a, b) => a - b)
          .map((y) =>
            this.meta.visual[y]
              .map((d) => `  ${y} ${d}`)
              .flat()
              .join('\n'),
          )}`.toString(),
      )
      return
    }
    try {
      await VisualView.show(year, day)
    } catch (e) {
      this.print(e)
    }
  }

  async test(year, day) {
    const sy = String(year)
    if (
      (year && !Object.keys(this.meta.puzzle).includes(sy)) ||
      (day && !this.meta.puzzle[sy].includes(day))
    ) {
      this.print(
        `test <year> [<day>]\n\navailable:\n${Object.keys(this.meta.visual)
          .sort((a, b) => a - b)
          .map((y) => `  ${y}`)
          .join('\n')}`,
      )
      return
    }
    if (day) {
      const r = await test(year, day)
      const tst = (v) =>
        N('span', (v ? '✅' : '❌').padStart(2), { class: `test ${v ? 'ok' : 'nok'}` })
      const prnt = (part) => [tst(part.test.ok)]
      this.print([`${year}-${String(day).padStart(2, 0)}`, ...prnt(r.part1), ...prnt(r.part2)])
      return
    }
    const days = (year ? [year] : Object.keys(this.meta.puzzle).sort((a, b) => a - b))
      .map((y) => this.meta.puzzle[y].map((d) => [y, d]))
      .flat()
    for (let yd of days) await this.test(yd[0], yd[1])
  }

  async solve(year, day, submit) {
    const sy = String(year)
    if (
      (year && !Object.keys(this.meta.puzzle).includes(sy)) ||
      (day && !this.meta.puzzle[sy].includes(day))
    ) {
      this.print(
        `run <year> [<day>]\n\navailable:\n${Object.keys(this.meta.visual)
          .sort((a, b) => a - b)
          .map((y) => `  ${y}`)
          .join('\n')}`,
      )
      return
    }
    if (day) {
      const r = await run(year, day)
      const tc = (t) =>
        N('span', `${String(Number(t / 10).toFixed(1)).padStart(7)} ms`, {
          class: `c${String(t * 10).length - 1}`,
        })
      const test = (v) =>
        N('span', (v ? '✅' : '❌').padStart(10), { class: `test ${v ? 'ok' : 'nok'}` })
      const val = (v) =>
        N('span', String(v).padStart(17), { class: `run ${v !== -1 ? 'ok' : 'nok'}` })
      const prnt = (part) => [test(part.test.ok), tc(part.run.time * 10), val(part.run.result)]
      this.print([`${year}-${String(day).padStart(2, 0)}`, ...prnt(r.part1), ...prnt(r.part2)])
      if (submit) {
        const value = submit === 2 ? r.part2.run.result : r.part1.run.result
        this.print(`submit part ${submit}: ${value}`)
        const output = await submitAnswer(year, day, submit, value)
        this.print(N('span', output, { class: 'answer' }))
      }
      return
    }
    const days = (year ? [year] : Object.keys(this.meta.puzzle).sort((a, b) => a - b))
      .map((y) => this.meta.puzzle[y].map((d) => [y, d]))
      .flat()
    for (let yd of days) await this.solve(yd[0], yd[1])
  }

  async parseCommand(cmd) {
    const tok = cmd.trim().split(/\s+/)
    this.history.push(cmd)
    this.histPtr = this.history.length
    const command = new WaitCommand(cmd)
    this.output.appendChild(command.getView())

    try {
      switch (tok[0]) {
        case '':
          this.print('')
          break
        case 'check':
          void this.check()
          break
        case 'clear':
          clear(this.output)
          break
        case 'input':
          await this.input(...tok.slice(1).map(Number))
          break
        case 'test':
          await this.test(...tok.slice(1).map((n) => Number(n)))
          break
        case 'run':
          await this.solve(...tok.slice(1).map((n) => Number(n)))
          break
        case 'viz':
          await this.viz(...tok.slice(1).map((n) => Number(n)))
          break
        default:
          this.print(USAGE)
      }
    } catch (e) {
      this.print(e)
    } finally {
      command.stop()
    }
  }

  async keyHandler(e) {
    //console.log(e.keyCode)
    if (e.keyCode === 13) {
      void this.parseCommand(e.target.value.trim())
      e.target.value = ''
    } else if (e.keyCode === 40) {
      this.histPtr = (this.histPtr + 1) % this.history.length
      e.target.value = this.history[this.histPtr]
      e.target.focus()
    } else if (e.keyCode === 38) {
      this.histPtr = (this.histPtr + this.history.length - 1) % this.history.length
      e.target.value = this.history[this.histPtr]
      e.target.focus()
    }
  }
}
