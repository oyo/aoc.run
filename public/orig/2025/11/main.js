import { Graph } from './graph.js'

export const P = {
  prep: (T) =>
    T.trim()
      .split('\n')
      .map((L) => L.split(': '))
      .map((L) => [L[0], L[1].split(' ')]),

  part_1: (T) => {
    const g = new Graph()
    const p = P.prep(T)
    p.forEach((n) => g.addVertex(n[0]))
    g.addVertex('out')
    p.forEach((n) => n[1].forEach((m) => g.addEdge(n[0], m, true)))
    return g.pathsBetween('you', 'out')
  },

  getData: () => P.data,

  init: (raw) => {
    const prep = P.prep(raw)
    const graph = new Graph().addNodes(prep.map((n) => n[0]).concat('out'))
    prep.forEach((n) => graph.addEdges(n[1].map((e) => [n[0], e, true])))
    P.data = {
      raw,
      prep,
      graph,
    }
    return P
  },
}

export class Game {
  constructor(puzzle) {
    const gnode = document.createElement('div')
    document.body.appendChild(gnode)
    const graph = puzzle.getData().graph
    const num = graph.pathsBetweenCount('you', 'out')
    console.log(num)
    const pv = graph.pathsVisited.reduce((a, c) => a | c, 0n)
    this.graph = new ForceGraph3D(gnode)
      .linkDirectionalArrowLength(3.5)
      .linkDirectionalArrowRelPos(1)
      .nodeColor((n) =>
        ['you', 'out', 'svr'].includes(n.name)
          ? '#88ff88'
          : ['fft', 'dac'].includes(n.name)
            ? '#ff8888'
            : (pv >> n.id) & 1n
              ? '#aaaaaa'
              : '#222222',
      )
      .linkColor((e) => ((pv >> e.source) & 1n & ((pv >> e.target) & 1n) ? '#aaaaaa' : '#222222'))
      .graphData(graph.getAsFDL())
  }
}
