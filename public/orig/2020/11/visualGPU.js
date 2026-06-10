// credits to https://codelabs.developers.google.com/your-first-webgpu-app

const prep = (T) =>
  T.trim()
    .split('\n')
    .map((L) => L.split('').map((c) => (c === 'L' ? 1 : 0)))

const border = (p, n) => [
  new Array(p[0].length + 2).fill(n),
  ...p.map((r) => [n, ...r, n]),
  new Array(p[0].length + 2).fill(n),
]

export default async (T) => {
  const b = border(prep(T), 0)
  const GRID_SIZE = b[0].length
  const GRID_Y = b.length
  b.push(new Array(GRID_SIZE).fill(0))
  b.push(new Array(GRID_SIZE).fill(0))
  b.push(new Array(GRID_SIZE).fill(0))
  const bflat = b.reverse().flat()
  const WORKGROUP_SIZE = 8
  const UPDATE_INTERVAL = 100
  let step = 0

  const adapter = await navigator.gpu?.requestAdapter()
  const device = await adapter?.requestDevice()
  if (!device) throw new Error('Error getting GPU device')

  const canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  const context = canvas.getContext('webgpu')
  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({
    device,
    format,
  })

  const vertices = new Float32Array([
    -0.8, -0.8, 0.8, -0.8, 0.8, 0.8,

    -0.8, -0.8, 0.8, 0.8, -0.8, 0.8,
  ])
  const vertexBuffer = device.createBuffer({
    label: 'Cell vertices',
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  })
  device.queue.writeBuffer(vertexBuffer, 0, vertices)
  const vertexBufferLayout = {
    arrayStride: 8,
    attributes: [
      {
        format: 'float32x2',
        offset: 0,
        shaderLocation: 0,
      },
    ],
  }

  const simulationShaderModule = device.createShaderModule({
    label: 'Board simulation shader',
    code: /* WGSL */ `
    @group(0) @binding(0) var<uniform> grid: vec2f;

    @group(0) @binding(1) var<storage> cellStateIn: array<u32>;
    @group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

    fn cellIndex(x: u32, y: u32) -> u32 {
      return (y % u32(grid.y)) * u32(grid.x) +
              (x % u32(grid.x));
    }

    fn cellAdjacent(x: u32, y: u32) -> u32 {
      if (cellStateIn[cellIndex(x, y)] == 2u) {
        return 1u;
      }
      return 0u;
    }

    fn adjacentCount(x: u32, y: u32) -> u32 {
      return cellAdjacent(x+1, y+1) +
        cellAdjacent(x+1, y) +
        cellAdjacent(x+1, y-1) +
        cellAdjacent(x,   y-1) +
        cellAdjacent(x,   y+1) +
        cellAdjacent(x-1, y-1) +
        cellAdjacent(x-1, y) +
        cellAdjacent(x-1, y+1);
    }

    fn part1Rule(s: u32, c: u32) -> u32 {
      if (s == 1u && c == 0u) {
        return 2u;
      }
      if (s == 2u && c > 3u) {
        return 1u;
      }
      return s;
    }

    @compute @workgroup_size(${WORKGROUP_SIZE}, ${WORKGROUP_SIZE})
    fn computeMain(@builtin(global_invocation_id) cell: vec3u) {
      let i = cellIndex(cell.x, cell.y);
      let d = cellStateIn[i];
      let n = adjacentCount(cell.x, cell.y);
      cellStateOut[i] = part1Rule(d, n);
    }
  `,
  })

  const cellShaderModule = device.createShaderModule({
    label: 'Cell shader',
    code: /* WGSL */ `
struct VertexInput {
  @location(0) pos: vec2f,
  @builtin(instance_index) instance: u32,
};

struct VertexOutput {
  @builtin(position) pos: vec4f,
  @location(0) cell: vec2f,
};

@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cellState: array<u32>;

@vertex
fn vertexMain(@location(0) pos: vec2f,
              @builtin(instance_index) instance: u32) -> VertexOutput {
  let i = f32(instance);
  let cell = vec2f(i % grid.x, floor(i / grid.x));
  let state = f32(cellState[instance]/2);

  let cellOffset = cell / grid * 2;
  let gridPos = (pos*state+1) / grid - 1 + cellOffset;

  var output: VertexOutput;
  output.pos = vec4f(gridPos, 0, 1);
  output.cell = cell;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  let c = input.cell / grid;
  return vec4f(c, 1-c.x, 1);
}`,
  })

  const cellStateArray = new Uint32Array(bflat.length)
  const cellStateStorage = [
    device.createBuffer({
      label: 'Cell State A',
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    }),
    device.createBuffer({
      label: 'Cell State B',
      size: cellStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST | GPUBufferUsage.COPY_SRC,
    }),
  ]
  for (let i = 0; i < cellStateArray.length; ++i) cellStateArray[i] = bflat[i]
  device.queue.writeBuffer(cellStateStorage[0], 0, cellStateArray)
  device.queue.writeBuffer(cellStateStorage[1], 0, cellStateArray)

  const uniformArray = new Float32Array([GRID_SIZE, GRID_SIZE])
  const uniformBuffer = device.createBuffer({
    label: 'Grid Uniforms',
    size: uniformArray.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  })
  device.queue.writeBuffer(uniformBuffer, 0, uniformArray)

  const bindGroupLayout = device.createBindGroupLayout({
    label: 'Cell Bind Group Layout',
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE | GPUShaderStage.FRAGMENT,
        buffer: {},
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' },
      },
      {
        binding: 2,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
    ],
  })

  const bindGroups = [
    device.createBindGroup({
      label: 'Cell renderer bind group A',
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: uniformBuffer },
        },
        {
          binding: 1,
          resource: { buffer: cellStateStorage[0] },
        },
        {
          binding: 2,
          resource: { buffer: cellStateStorage[1] },
        },
      ],
    }),
    device.createBindGroup({
      label: 'Cell renderer bind group B',
      layout: bindGroupLayout,
      entries: [
        {
          binding: 0,
          resource: { buffer: uniformBuffer },
        },
        {
          binding: 1,
          resource: { buffer: cellStateStorage[1] },
        },
        {
          binding: 2,
          resource: { buffer: cellStateStorage[0] },
        },
      ],
    }),
  ]

  const pipelineLayout = device.createPipelineLayout({
    label: 'Cell Pipeline Layout',
    bindGroupLayouts: [bindGroupLayout],
  })

  const cellPipeline = device.createRenderPipeline({
    label: 'Cell pipeline',
    layout: pipelineLayout,
    vertex: {
      module: cellShaderModule,
      entryPoint: 'vertexMain',
      buffers: [vertexBufferLayout],
    },
    fragment: {
      module: cellShaderModule,
      entryPoint: 'fragmentMain',
      targets: [
        {
          format,
        },
      ],
    },
  })

  const simulationPipeline = device.createComputePipeline({
    label: 'Simulation pipeline',
    layout: pipelineLayout,
    compute: {
      module: simulationShaderModule,
      entryPoint: 'computeMain',
    },
  })

  function render(encoder) {
    const enc = encoder ?? device.createCommandEncoder()
    const render = enc.beginRenderPass({
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          loadOp: 'clear',
          clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
          storeOp: 'store',
        },
      ],
    })
    render.setPipeline(cellPipeline)
    render.setBindGroup(0, bindGroups[step % 2])
    render.setVertexBuffer(0, vertexBuffer)
    render.draw(vertices.length / 2, GRID_SIZE * GRID_SIZE)
    render.end()
    if (!encoder) device.queue.submit([enc.finish()])
  }

  function compute(encoder) {
    const enc = encoder ?? device.createCommandEncoder()
    const compute = enc.beginComputePass()
    compute.setPipeline(simulationPipeline)
    compute.setBindGroup(0, bindGroups[step % 2])
    const workgroupCount = Math.ceil(GRID_SIZE / WORKGROUP_SIZE)
    compute.dispatchWorkgroups(workgroupCount, workgroupCount)
    compute.end()
    if (!encoder) device.queue.submit([enc.finish()])
  }

  function update() {
    const encoder = device.createCommandEncoder()
    compute(encoder)
    step++
    render(encoder)
    compute(encoder)
    step++
    device.queue.submit([encoder.finish()])
  }

  function resize() {
    const canvas = document.querySelector('canvas')
    const width = document.body.clientWidth
    const height = document.body.clientHeight
    const s = Math.min(width, height)
    canvas.width = s
    canvas.height = s
    render()
  }

  new ResizeObserver((_) => resize()).observe(document.body)

  const BUFFER_SIZE = cellStateArray.byteLength

  const stagingBuffer = device.createBuffer({
    size: BUFFER_SIZE,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  })

  async function readFromGPU() {
    const commandEncoder = device.createCommandEncoder()
    commandEncoder.copyBufferToBuffer(cellStateStorage[step % 2], 0, stagingBuffer, 0, BUFFER_SIZE)
    device.queue.submit([commandEncoder.finish()])
    await stagingBuffer.mapAsync(GPUMapMode.READ)
    const copyArrayBuffer = stagingBuffer.getMappedRange(0, BUFFER_SIZE)
    const data = copyArrayBuffer.slice(0)
    stagingBuffer.unmap()
    const grid = new Uint32Array(data)
    const out = [...Array(GRID_SIZE).keys()]
      .reverse()
      .map((r) => grid.slice(r * GRID_SIZE, (r + 1) * GRID_SIZE).join(','))
      .join('\n')
    console.log(out)
  }

  resize()
  setInterval(update, UPDATE_INTERVAL)
}
