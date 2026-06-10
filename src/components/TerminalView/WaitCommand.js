import { N, Viewable } from '@/aoc/ui'
import { WaitPrompt } from './WaitPrompt'

export class WaitCommand extends Viewable {
  constructor(command) {
    super()
    WaitPrompt.start().cb(() => {
      this.view.prepend(N('span', '$'))
    })
    this.view = N('span', [WaitPrompt, ' ' + command])
  }

  stop() {
    WaitPrompt.stop()
  }
}
