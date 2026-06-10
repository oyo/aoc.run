export const valid = (T) => /^(\d+-\d+,\n?)+\d+-\d+\n?$/.test(T)

const prep = (T) =>
  T.trim()
    .split(',')
    .map((L) => L.split('-').map(Number))

const checkN = (id, n) => (new RegExp('^(' + id.slice(0, n) + ')+$').test(id) ? Number(id) : 0)

const isInvalid1 = (id) => {
  id = id.toString()
  const lid = id.length
  const mid = lid / 2
  if (lid % 2 !== 0) return 0
  return checkN(id, mid)
}

const isInvalid2 = (id) => {
  id = id.toString()
  const lid = id.length
  let invalid = 0
  for (let i = 1; i <= lid / 2 && !invalid; i++) if (lid % i === 0) invalid = checkN(id, i)
  return invalid
}

const checkRange = ([a, b], inv) => {
  let s = 0
  for (let id = a; id <= b; id++) s += inv(id)
  return s
}

const run = (T, inv) => prep(T).reduce((a, c) => a + checkRange(c, inv), 0)

export const part1 = (T) => run(T, isInvalid1)

export const part2 = (T) => run(T, isInvalid2)
