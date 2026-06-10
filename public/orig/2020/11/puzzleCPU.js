// { '.': 0, 'L': 1, '#': 2 }

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split('').map((c) => (c === 'L' ? 1 : 0)))

const border = (p, n) => [
  new Array(p[0].length + 2).fill(n),
  ...p.map((r) => [n, ...r, n]),
  new Array(p[0].length + 2).fill(n),
]

const dup = (b) => b.map((y) => [...y])

const visD = (p, sy, sx, dy, dx) => {
  let seen = false
  for (
    let x = sx + dx, y = sy + dy;
    y > 0 && y < p.length - 1 && x > 0 && x < p[0].length - 1 && !seen;
    x += dx, y += dy
  ) {
    seen = p[y][x] !== 0 ? p[y][x] : false
  }
  return seen === 2 ? 1 : 0
}

const adjacentCount = (p, y, x) =>
  (p[y - 1][x - 1] === 2 ? 1 : 0) +
  (p[y - 1][x] === 2 ? 1 : 0) +
  (p[y - 1][x + 1] === 2 ? 1 : 0) +
  (p[y][x - 1] === 2 ? 1 : 0) +
  (p[y][x + 1] === 2 ? 1 : 0) +
  (p[y + 1][x - 1] === 2 ? 1 : 0) +
  (p[y + 1][x] === 2 ? 1 : 0) +
  (p[y + 1][x + 1] === 2 ? 1 : 0)

const visibleCount = (p, y, x) =>
  visD(p, y, x, -1, -1) +
  visD(p, y, x, -1, 0) +
  visD(p, y, x, -1, 1) +
  visD(p, y, x, 0, -1) +
  visD(p, y, x, 0, 1) +
  visD(p, y, x, 1, -1) +
  visD(p, y, x, 1, 0) +
  visD(p, y, x, 1, 1)

const step = (board, counter, rule) => {
  board.push(board.shift())
  const p = board[0]
  const p1 = board[1]
  for (let y = 1; y < p.length - 1; y++)
    for (let x = 1; x < p[y].length - 1; x++) p[y][x] = rule(p1[y][x], counter(p1, y, x))
  return p.reduce((a, y) => a + y.filter((c) => c === 2).length, 0)
}

const run = (board, counter, rule) => {
  let c0 = -2
  let count = -1
  while (count !== c0) {
    c0 = count
    count = step(board, counter, rule)
  }
  return count
}

const part1Rule = (s, c) => (s === 1 && c === 0 ? 2 : s === 2 && c > 3 ? 1 : s)

const part2Rule = (s, c) => (s === 1 && c === 0 ? 2 : s === 2 && c > 4 ? 1 : s)

const exec = async (T) => {
  const start = performance.now()
  const v = border(prep(T), 0)
  const result = [
    run([dup(v), dup(v)], adjacentCount, part1Rule),
    run([dup(v), dup(v)], visibleCount, part2Rule),
  ]
  const time = performance.now() - start
  return { time, result }
}

export default {
  prep,
  border,
  dup,
  adjacentCount,
  visibleCount,
  step,
  run,
  part1Rule,
  part2Rule,
  exec,
}
