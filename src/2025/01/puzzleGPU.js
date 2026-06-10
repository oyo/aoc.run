import { arrN } from '../../lib/aoc/execGPU.js'

const WGSL = /* WGSL */ `
struct InputData {
    values: array<i32>,
};

struct OutputData {
    part1: i32,
    part2: i32,
};

@group(0) @binding(0) var<storage, read> input: InputData;
@group(0) @binding(1) var<storage, read_write> output: OutputData;

fn part1(arr: ptr<storage, array<i32>>) -> i32 {
    var pos: i32 = 50;
    var count: i32 = 0;
    for (var i = 0; i < i32(arrayLength(arr)); i += 1) {
        pos = (pos + (*arr)[i]) % 100;
        if (pos == 0) {
          count += 1;
        }
    }
    return count;
}

fn part2(arr: ptr<storage, array<i32>>) -> i32 {
    var pos: i32 = 50;
    var count: i32 = 0;
    var c: i32 = 0;
    var n: i32 = 0;
    for (var i = 0; i < i32(arrayLength(arr)); i += 1) {
        c = (*arr)[i];
        count += abs(c) / 100;
        n = pos + c % 100;
        if (n > 99 || (n <= 0 && pos != 0)) {
          count += 1;
        }
        pos = (n + 100) % 100;
    }
    return count;
}

@compute @workgroup_size(1, 1, 1)
fn main() {
    output.part1 = part1(&input.values);
    output.part2 = part2(&input.values);
}
`

const N = (n) => parseInt(n)

const prep = (T) => T.trim().replaceAll('L', '-').replaceAll('R', '').split('\n').map(N)

export default (exec = async (T) => {
  const start = performance.now()
  const result = await arrN(WGSL, prep(T))
  const time = performance.now() - start
  return { time, result }
})
