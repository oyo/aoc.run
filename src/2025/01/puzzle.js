export const valid = (T) => /^([LR]\d+\n)+[LR]\d+\n?$/.test(T)

const prep = (T) => T.trim().replaceAll('L', '-').replaceAll('R', '').split('\n').map(Number)

const stop0 = (a, c) => ((a[1] += !(a[0] = (a[0] + c) % 100)), a)

const pass0 = (a, c) => {
  a[1] += ~~(Math.abs(c) / 100)
  const n = a[0] + (c % 100)
  if (n > 99 || (n <= 0 && a[0] !== 0)) a[1]++
  a[0] = (n + 100) % 100
  return a
}

const run = (v, R) => v.reduce(R, [50, 0])[1]

export const part1 = (T) => run(prep(T), stop0)

export const part2 = (T) => run(prep(T), pass0)
