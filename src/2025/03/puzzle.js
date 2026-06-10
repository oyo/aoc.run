export const valid = (T) => /^(\d+\n)+\d+\n?$/.test(T)

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split('').map(Number))

const jolt = (l, b) => {
  const d = []
  for (let o = [...b].sort((a, b) => b - a), oi = 0; d.length < l; oi++) {
    const n = o[oi]
    const i = b.indexOf(n)
    if (i >= 0 && i < b.length - (l - d.length - 1)) {
      d.push(n)
      o.splice(oi, 1)
      b = b.slice(i + 1)
      oi = -1
    }
  }
  return Number(d.join(''))
}

export const part1 = (T) => prep(T).reduce((a, c) => a + jolt(2, c), 0)

export const part2 = (T) => prep(T).reduce((a, c) => a + jolt(12, c), 0)
