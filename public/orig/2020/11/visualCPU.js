import { Viewer, VoxelScene, Shape, COLOR } from '../../lib/voxli/index.js'
import puzzle from './puzzleCPU.js'

class PuzzleScene extends VoxelScene {
  style = {
    2: { color: COLOR.BLUE },
  }

  constructor(input) {
    super()
    const { prep, border } = puzzle
    this.raw = border(prep(input).reverse(), 0)
    this.init(this.part)
    setInterval(this.step.bind(this), 50)
  }

  init(isPart2) {
    this.part = isPart2
    const { dup, step, adjacentCount, part1Rule, visibleCount, part2Rule } = puzzle
    this.board = [dup(this.raw), dup(this.raw)]
    if (isPart2) {
      this.counter = visibleCount
      this.rule = part2Rule
    } else {
      this.counter = adjacentCount
      this.rule = part1Rule
    }
    //step(this.board, this.counter, this.rule)
    this.data = this.board
    this.result = 0
  }

  step() {
    const { step } = puzzle
    let result = step(this.board, this.counter, this.rule)
    result = step(this.board, this.counter, this.rule)
    this.data = this.board
    this.updateModel()
    if (result === this.result) {
      console.log(`part ${this.part ? 2 : 1} = ${result}`)
      this.init(!this.part)
    } else {
      this.result = result
    }
  }
}

const visualCPU = (input) => new Viewer(new PuzzleScene(input)).input.setMove({ u: -46.25, w: -20 })

export default visualCPU
