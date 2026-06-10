import { arrN } from '../../lib/aoc/execGPU.js'

const WGSL = /* WGSL */ `
struct InputData {
    values: array<i32>,
};

struct OutputData {
    part1: i32,
    part2: i32,
};

@group(0) @binding(0) var<storage, read_write> input: InputData;
@group(0) @binding(1) var<storage, read_write> output: OutputData;

fn part1(arr: ptr<storage, array<i32>>) -> i32 {
    let len: i32 = i32(arrayLength(arr)) / 2;
    var grid: i32 = i32(sqrt(f32(len)));
    var count: i32 = 0;
    for (var y = 1; y < grid-1; y += 1) {
        for (var x = 1; x < grid-1; x += 1) {
            let d = (*arr)[y*grid + x];
            var n = 0;
            if (d == 1) {
              n = (*arr)[(y - 1) * grid + x - 1]
                + (*arr)[(y - 1) * grid + x    ]
                + (*arr)[(y - 1) * grid + x + 1]
                + (*arr)[ y      * grid + x - 1]
                + (*arr)[ y      * grid + x + 1]
                + (*arr)[(y + 1) * grid + x - 1]
                + (*arr)[(y + 1) * grid + x    ]
                + (*arr)[(y + 1) * grid + x + 1];
            }
            if (d == 1 && n < 4) {
                count++;
            }
        }
    }
    return count;
}

fn part2(arr: ptr<storage, array<i32>>) -> i32 {
    var b0: i32 = 0;
    var b1: i32 = 1;
    let len: i32 = i32(arrayLength(arr)) / 2;
    var grid: i32 = i32(sqrt(f32(len)));
    var count: i32 = 0;
    for (
        var a = 1;
        a > 0;
        b0 = (b0 + 1) % 2
    ) {
        b1 = (b0 + 1) % 2;
        a = 0;
        for (var y = 1; y < grid-1; y += 1) {
            for (var x = 1; x < grid-1; x += 1) {
                let d = (*arr)[b0 * len + y * grid + x];
                var n = 0;
                if (d == 1) {
                n =   (*arr)[b0 * len + (y - 1) * grid + x - 1]
                    + (*arr)[b0 * len + (y - 1) * grid + x    ]
                    + (*arr)[b0 * len + (y - 1) * grid + x + 1]
                    + (*arr)[b0 * len +  y      * grid + x - 1]
                    + (*arr)[b0 * len +  y      * grid + x + 1]
                    + (*arr)[b0 * len + (y + 1) * grid + x - 1]
                    + (*arr)[b0 * len + (y + 1) * grid + x    ]
                    + (*arr)[b0 * len + (y + 1) * grid + x + 1];
                }
                if (n > 0) {
                    (*arr)[b1 * len + y * grid + x] = 1;
                } else {
                    (*arr)[b1 * len + y * grid + x] = 0;
                }
                if (d == 1 && n < 4) {
                    a++;
                    count++;
                    (*arr)[b1 * len + y * grid + x] = 0;
                }
            }
        }
    }
    return count;
}

@compute @workgroup_size(1, 1, 1)
fn main() {
    output.part1 = part1(&input.values);
    output.part2 = part2(&input.values);
}
`

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

const exec = async (T) => {
  const start = performance.now()
  const p = border(prep(T), 0)
  const v = [p, dup(p, 0)].flat(2)
  console.log(v.length)
  const result = await arrN(WGSL, v)
  const time = performance.now() - start
  return { time, result }
}

export default { exec }
