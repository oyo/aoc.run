const N = (n) => Number.parseInt(n)

const prep = (T) => T.trim().replaceAll('L', '-').replaceAll('R', '').split('\n').map(N)

const stop0 = (a, c) => ((a[1] += !(a[0] = (a[0] + c) % 100)), a)

const pass0 = (a, c) => {
  a[1] += ~~(Math.abs(c) / 100)
  const n = a[0] + (c % 100)
  if (n > 99 || (n <= 0 && a[0] !== 0)) a[1]++
  a[0] = (n + 100) % 100
  return a
}

const run = (v, R) => v.reduce(R, [50, 0])[1]

const exec = async (T) => {
  const start = performance.now()
  const v = prep(T)
  const result = [run(v, stop0), run(v, pass0)]
  const time = performance.now() - start
  return { time, result }
}

export default { exec }
