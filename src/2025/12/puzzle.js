export const valid = (T) => /^(\d:\n([.#]{3}\n){3}\n){6}((\d+x\d+):( \d+){6}\n?)+$/.test(T)

const d = (s) =>
  [
    (s >> 6).toString(2).padStart(3, 0),
    ((s & 56) >> 3).toString(2).padStart(3, 0),
    (s & 7).toString(2).padStart(3, 0),
  ]
    .join('\n')
    .replaceAll('1', '#')
    .replaceAll('0', '.')

const genFlipRot = (s) => {
  const r1 = (t) =>
    ((t & 4) << 6) |
    ((t & 32) << 2) |
    ((t & 256) >> 2) |
    ((t & 2) << 4) |
    (t & 16) |
    ((t & 128) >> 4) |
    ((t & 1) << 2) |
    ((t & 8) >> 2) |
    ((t & 64) >> 6)
  const f = (t) => ((t & 7) << 6) | (t & 56) | (s >> 6)
  const s1 = f(s)
  const c = new Set([s, r1(s), r1(r1(s)), r1(r1(r1(s))), s1, r1(s1), r1(r1(s1)), r1(r1(r1(s1)))])
  return [...c]
}

const bc = (n) => {
  let c = 0
  while (n) {
    c += n & 1
    n >>= 1
  }
  return c
}

const prep = (T) =>
  ((B) => [
    B.slice(0, 6).map((S) =>
      parseInt(S.substring(3).replaceAll('\n', '').replaceAll('.', '0').replaceAll('#', '1'), 2),
    ),
    B[6]
      .split('\n')
      .map((R) => R.split(': '))
      .reduce((a, c) => a.concat([[c[0].split('x').map(Number), c[1].split(' ').map(Number)]]), []),
  ])(T.trim().split('\n\n'))

export const part1 = (T) => {
  const p = prep(T)
  const q = p[0].map((s) => bc(s))
  return p[1]
    .map((r) => r[0][0] * r[0][1] - r[1].reduce((a, c, i) => a + c * q[i], 0))
    .filter((v) => v > 0).length
}

export const part2 = (T) => true
