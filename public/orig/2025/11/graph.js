// implementation for graphs where nodes and edges are added only, never removed

export class Graph {
  constructor() {
    this.nodeMap = new Map()
    this.nodes = new Array()
    this.edges = new Array()
    this.nodesVisited = 0n
    this.edgesVisited = 0n
    this.pathsVisited = new Array()
  }

  addNode(n) {
    const id = BigInt(typeof n === 'number' || typeof n === 'bigint' ? n : this.nodes.length)
    const node = {
      id,
      name: n.toString(),
      edges: [],
    }
    this.nodeMap.set(n, node)
    this.nodes[id] = node
    return this
  }

  addNodes(nodes) {
    nodes.forEach((n) => this.addNode(n))
    return this
  }

  addEdge([a, b, uni]) {
    const ai = typeof a === 'string' ? this.nodeMap.get(a).id : a
    const bi = typeof b === 'string' ? this.nodeMap.get(b).id : b
    const edge = [ai, bi, uni]
    this.edges.push(edge)
    this.nodes[ai].edges.push(edge)
    if (!uni) this.nodes[bi].edges.push(edge)
    return this
  }

  addEdges(edges) {
    edges.forEach((e) => this.addEdge(e))
    return this
  }

  print() {
    let get_keys = this.nodes.keys()
    for (let i of get_keys) {
      let get_values = this.nodes.get(i)
      let conc = ''
      for (let j of get_values) conc += j + ' '
      console.log(i + ' -> ' + conc)
    }
  }

  bfs(start) {
    let visited = {}
    let q = new Array()
    visited[start] = true
    q.push(start)
    while (q.length !== 0) {
      let qe = q.shift()
      console.log(qe)
      let get_List = this.nodes.get(qe)
      for (let i in get_List) {
        let neigh = get_List[i]
        if (!visited[neigh]) {
          visited[neigh] = true
          q.push(neigh)
        }
      }
    }
  }

  dfsRek(vert, visited) {
    visited[vert] = true
    console.log(vert)
    let neighbors = this.nodes.get(vert)
    for (let n of neighbors) if (!visited[n]) this.dfsRek(n, visited)
  }

  dfs(start) {
    let visited = {}
    this.dfsRek(start, visited)
  }

  pathsBetweenCount(a, b) {
    const ai = typeof a === 'string' ? this.nodeMap.get(a).id : BigInt(a)
    const bi = typeof b === 'string' ? this.nodeMap.get(b).id : BigInt(b)
    this.pathsVisited = new Array()
    let v = 0n
    let s = 0
    const count = (c) => {
      if (c === bi) {
        this.pathsVisited.push(v)
        s++
        return
      }
      v |= 1n << c
      let edges = this.nodes[c].edges
      for (let e of edges) if (!((v >> e[1]) & 1n)) count(e[1])
      v &= ~(1n << c)
    }
    count(ai)
    //console.log(this.pathsVisited.map(w => w.toString(2)).join('\n'))
    this.nodesVisited = v
    return s
  }

  getAsFDL() {
    return {
      nodes: this.nodes,
      links: this.edges.map((e, i) => ({
        id: i,
        source: e[0],
        target: e[1],
      })),
    }
  }
}
