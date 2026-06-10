import { addEvents, N, Viewable } from '@/aoc/ui'
import { dropIn } from 'drop.that'
import './style.css'
import Config from '@/aoc/config'

export class VisualViewSingle extends Viewable {
  constructor() {
    super()
    this.closeButton = addEvents(N('button', '✕'), {
      click: (() => {
        this.stop()
        this.remove()
      }).bind(this),
    })
    this.view = N('div', this.closeButton, { class: 'visual' })
  }

  async show(year, day) {
    const context = location.host === 'localhost:4000' ? '../..' : `${Config.BASE_UI}/src`
    const path = `${context}/${year}/${String(day).padStart(2, '0')}`
    const { valid } = await import(`${path}/puzzle.js`)
    const { visual, stop } = await import(`${path}/visual.js`)
    this.stop = stop
    this.clear()
      .appendTo(document.body)
      .append(
        await visual(
          await dropIn({
            placeholderText: `paste input from\n\nhttps://adventofcode.com/${year}/day/${day}/input`,
            apiIn: `/aoc/${year}/day/${day}/input`,
            valid,
            autoStart: true,
          }),
        ),
      )
      .append(this.closeButton)
    return this
  }
}

export const VisualView = new VisualViewSingle()
