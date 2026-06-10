export const valid = (T) => /^((\[[.#]+\])( \((\d+,)*\d+\))+ {(\d+,)+\d+}\n?)+$/.test(T)

const bitsSet = (N, M) => {
  const result = new Set()
  const generate = (pos, count, num) => {
    if (count === M) {
      result.add(num)
      return
    }
    if (pos === N || count + (N - pos) < M) return
    generate(pos + 1, count + 1, num | (1 << pos))
    generate(pos + 1, count, num)
  }
  generate(0, 0, 0)
  return result
}

const bitIndices = (N, M) => {
  const idx = []
  for (let i = 0; i < M; i++) N & (1 << i) && idx.push(M - i - 1)
  return idx
}

const button = (b, l) => b.reduce((a, c) => a | (1 << (l - c - 3)), 0)

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split(' '))
    .map((L) => [
      parseInt(L[0].replace(/[[\]]/g, '').replace(/\./g, '0').replace(/#/g, '1'), 2),
      L.slice(1, L.length - 1)
        .map((b) => b.replace(/[()]/g, '').split(',').map(Number))
        .map((b) => button(b, L[0].length)),
      L[L.length - 1].replace(/[{}]/g, '').split(',').map(Number),
    ])

const press = ([l, b]) => {
  let s = -1
  for (let i = 0; i <= b.length && s < 0; i++) {
    const nb = [...bitsSet(b.length, i)]
    for (let j = 0; j < nb.length && s < 0; j++)
      bitIndices(nb[j], b.length).reduce((a, c) => a ^ b[c], 0) === l && (s = i)
  }
  return s
}

export const part1 = (T) =>
  prep(T)
    .map((p) => press(p))
    .reduce((a, c) => a + c, 0)

// TODO: solve
export const part2 = (T) => {
  return -1
}
