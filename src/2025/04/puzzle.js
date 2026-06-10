export const valid = (T) => /^([@.]+\n)+[@.]+\n?$/.test(T)

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split('').map((c) => (c === '@' ? 1 : 0)))

const border = (p, n) => [
  Array.from({ length: p[0].length + 2 }).fill(n),
  ...p.map((r) => [n, ...r, n]),
  Array.from({ length: p[0].length + 2 }).fill(n),
]

const dup = (b, n) =>
  Array.from({ length: b.length })
    .fill(n)
    .map((_, i) => Array.from({ length: b[i].length }).fill(n))

//const dump = b => console.log(b.map(r => r.join(' ').replaceAll('0', '.').replaceAll('1', '@')).join('\n'))

export const part1 = (T) => {
  const b = border(prep(T), 0)
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

export const part2 = (T) => {
  const b = border(prep(T), 0)
  const p = [b, dup(b, 0)]
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
