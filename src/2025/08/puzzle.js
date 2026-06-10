export const valid = (T) => /^(\d+,\d+,\d+\n)+\d+,\d+,\d+\n?$/.test(T)

const dist = (a, b) => Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split(',').map(Number))

export const part1 = (T) => {
  const p = prep(T)
  const n = p.length < 100 ? 10 : 1000
  let q = []
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) q.push([dist(p[i], p[j]), i, j])
  const s = q.sort((a, b) => a[0] - b[0])
  const r = []
  for (let i = 0; i < n; i++) {
    const u = s[i]
    const v = r.filter((x) => x.has(u[1]) || x.has(u[2]))
    if (v.length === 0) {
      const n = new Set()
      n.add(u[1])
      n.add(u[2])
      r.push(n)
    } else if (v.length === 1) {
      v[0].add(u[1])
      v[0].add(u[2])
    } else if (v.length === 2) {
      v[0].forEach((x) => v[1].add(x))
      r.splice(r.indexOf(v[0]), 1)
    }
  }
  return r
    .sort((a, b) => b.size - a.size)
    .slice(0, 3)
    .reduce((a, c) => a * c.size, 1)
}

export const part2 = (T) => {
  const p = prep(T)
  let q = []
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++) q.push([dist(p[i], p[j]), i, j])
  const s = q.sort((a, b) => a[0] - b[0])
  const r = []
  let z = 0
  for (let i = 0; ; i++) {
    const u = s[i]
    const v = r.filter((x) => x.has(u[1]) || x.has(u[2]))
    if (v.length === 0) {
      const n = new Set()
      n.add(u[1])
      n.add(u[2])
      r.push(n)
    } else if (v.length === 1) {
      v[0].add(u[1])
      v[0].add(u[2])
    } else if (v.length === 2) {
      v[0].forEach((x) => v[1].add(x))
      r.splice(r.indexOf(v[0]), 1)
    }
    if (r[0].size === p.length) {
      z = p[u[1]][0] * p[u[2]][0]
      break
    }
  }
  return z
}
