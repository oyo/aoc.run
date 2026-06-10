class Graph {
  constructor() {
    this.nodes = new Map()
  }

  addVertex(v) {
    this.nodes.set(v, [])
  }

  addEdge(v, w, uni) {
    this.nodes.get(v).push(w)
    if (!uni) this.nodes.get(w).push(v)
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
    const v = {}
    let s = 0
    const count = (c) => {
      if (c === b) {
        s++
        return
      }
      v[c] = true
      let neighbors = this.nodes.get(c)
      for (let n of neighbors) if (!v[n]) count(n)
      v[c] = false
    }
    count(a)
    return s
  }

  pathsBetweenOOM(a, b) {
    const v = {}
    const paths = []
    const count = (c, p) => {
      if (c === b) {
        paths.push(p)
        return
      }
      v[c] = true
      let neighbors = this.nodes.get(c)
      for (let n of neighbors) if (!v[n]) count(n, [...p, n])
      v[c] = false
    }
    count(a, [a])
    return paths
  }

  pathsBetween(a, b) {
    const v = {}
    const paths = []
    const p = [a]
    const count = () => {
      let c = p[p.length - 1]
      if (c === b) {
        paths.push([...p])
        return
      }
      v[c] = true
      let neighbors = this.nodes.get(c)
      for (let n of neighbors)
        if (!v[n]) {
          p.push(n)
          count()
          p.pop()
        }
      v[c] = false
    }
    count(a)
    return paths
  }
}

export const valid = (T) => /^([a-z]{3}:( [a-z]{3})+\n?)+$/.test(T)

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split(': '))
    .map((L) => [L[0], L[1].split(' ')])

export const part1 = (T) => {
  const g = new Graph()
  const p = prep(T)
  p.forEach((n) => g.addVertex(n[0]))
  g.addVertex('out')
  p.forEach((n) => n[1].forEach((m) => g.addEdge(n[0], m, true)))
  return g.pathsBetweenCount('you', 'out')
}

// TODO: out of memory for actual input
export const part2 = (T) => {
  const g = new Graph()
  const p = prep(T)
  if (p.length > 20) {
    // out of mem
    return -1
  }
  p.forEach((n) => g.addVertex(n[0]))
  g.addVertex('out')
  p.forEach((n) => n[1].forEach((m) => g.addEdge(n[0], m, true)))
  return g.pathsBetween('svr', 'out').filter((r) => r.includes('dac') && r.includes('fft')).length
}
