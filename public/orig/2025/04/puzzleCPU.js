const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split('').map((c) => (c === '@' ? 1 : 0)))

const border = (p, n) => [
  new Array(p[0].length + 2).fill(n),
  ...p.map((r) => [n, ...r, n]),
  new Array(p[0].length + 2).fill(n),
]

const dup = (b, n) => new Array(b.length).fill(n).map((_, i) => new Array(b[i].length).fill(n))

//const dump = b => console.log(b.map(r => r.join(' ').replaceAll('0', '.').replaceAll('1', '@')).join('\n'))

const part1 = (b) => {
  let s = 0
  for (let y = 1; y < b.length - 1; y++) {
    for (let x = 1; x < b[y].length - 1; x++) {
      const d = b[y][x]
      const c =
        d === 1
          ? b[y - 1][x - 1] +
            b[y - 1][x] +
            b[y - 1][x + 1] +
            b[y][x - 1] +
            b[y][x + 1] +
            b[y + 1][x - 1] +
            b[y + 1][x] +
            b[y + 1][x + 1]
          : 0
      if (d === 1 && c < 4) s++
    }
  }
  return s
}

const part2 = (p) => {
  p = [p, dup(p, 0)]
  let s = 0
  for (let a = 1, b = p.shift(), r = p[0]; a > 0; p.push(b), b = p.shift(), r = p[0]) {
    a = 0
    for (let y = 1; y < b.length - 1; y++) {
      for (let x = 1; x < b[y].length - 1; x++) {
        const d = b[y][x]
        const n =
          d === 1
            ? b[y - 1][x - 1] +
              b[y - 1][x] +
              b[y - 1][x + 1] +
              b[y][x - 1] +
              b[y][x + 1] +
              b[y + 1][x - 1] +
              b[y + 1][x] +
              b[y + 1][x + 1]
            : 0
        r[y][x] = n > 0 ? 1 : 0
        if (d === 1 && n < 4) {
          a++
          s++
          r[y][x] = 0
        }
      }
    }
  }
  return s
}

const exec = async (T) => {
  const start = performance.now()
  const v = border(prep(T), 0)
  const result = [part1(v), part2(v)]
  const time = performance.now() - start
  return { time, result }
}

export default { exec }
