import { N, Viewable } from '@/aoc/ui'

export class WaitPromptSingle extends Viewable {
  chars = '⠉⠈⠘⠐⠰⠠⢠⢀⣀⡀⡄⠄⠆⠂⠃⠁'

  constructor() {
    super()
    this.view = N('span', '')
  }

  start() {
    this.c = 0
    this.view.innerText = this.chars[this.c]
    this.timer = setInterval(() => {
      this.c = (this.c + 1) % this.chars.length
      this.view.textContent = this.chars[this.c]
    }, 40)
    return this
  }

  cb(cb) {
    this.callback = cb
    return this
  }

  stop() {
    clearInterval(this.timer)
    this.remove()
    if (this.callback) this.callback()
    return this
  }
}

export const WaitPrompt = new WaitPromptSingle()
