export const valid = (T) => /^(( *\d+ *)+\n)+([+*] {0,4})+\n?$/.test(T)

const traN = (a) => a[0].map((_, c) => a.map((r) => Number(r[c])))
const rop = (p, o) => (o === '+' ? p.reduce((a, c) => a + c, 0) : p.reduce((a, c) => a * c, 1))

export const part1 = (T) =>
  ((p) => ((o, q) => o.reduce((a, c, i) => a + rop(q[i], c), 0))(p.pop(), traN(p)))(
    T.trim()
      .split('\n')
      .map((L) => L.trim().split(/ +/)),
  )

export const part2 = (T) => {
  let p = T.split('\n').slice(0, -1)
  let o = p.pop()
  if (p.length < 4) p.push(Array.from({ length: o.length + 1 }).join(' '))
  let s = 0
  for (let r = [], i = o.length - 1; i >= 0; i--) {
    r.push(Number(p[0][i] + p[1][i] + p[2][i] + p[3][i]))
    if (o[i] !== ' ') {
      s += rop(r, o[i])
      r = []
      i--
    }
  }
  return s
}
