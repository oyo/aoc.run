export const valid = (T) => /^([.S^]+\n)+[.S^]+\n?$/.test(T)

const prep = (T) =>
  T.trim()
    .split('\n')
    .filter((_, i) => i % 2 === 0)

export const part1 = (T) => {
  const p = prep(T)
  const b = [[p[0].indexOf('S')]]
  let s = 0
  for (let y = 1; y < p.length; y++) {
    const by = new Set()
    for (let x = 0; x < p[y].length; x++) {
      if (p[y][x] === '.') {
        if (b[y - 1].includes(x)) by.add(x)
      } else if (p[y][x] === '^' && b[y - 1].includes(x)) {
        s++
        by.add(x - 1)
        by.add(x + 1)
      }
    }
    b.push([...by])
  }
  return s
}

export const part2 = (T) => {
  const p = prep(T)
  const b = [[p[0].indexOf('S')]]
  const c = [new Array(p[0].length).fill(0)] //
  c[0][p[0].indexOf('S')] = 1
  let s = 0
  for (let y = 1; y < p.length; y++) {
    const by = new Set()
    let cy = new Array(p[0].length).fill(0)
    for (let x = 0; x < p[y].length; x++) {
      if (p[y][x] === '.') {
        if (b[y - 1].includes(x)) {
          by.add(x)
        }
        cy[x] += c[y - 1][x]
      } else if (p[y][x] === '^' && b[y - 1].includes(x)) {
        s++
        by.add(x - 1)
        by.add(x + 1)
        cy[x - 1] += c[y - 1][x]
        cy[x + 1] += c[y - 1][x]
      }
    }
    b.push([...by])
    c.push(cy)
  }
  return c.pop().reduce((a, b) => a + b, 0)
}
