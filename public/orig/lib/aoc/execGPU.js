/*
arrN
code: the logic to calculate two values (part1 and part2) on an array of numbers
values: data as array of integers
*/
export const arrN = async (code, values) => {
  const adapter = await navigator.gpu.requestAdapter()
  const device = await adapter.requestDevice()
  if (!device) throw new Error('Error getting GPU device')

  const inputArray = new Int32Array(values)
  const inputBufferSize = inputArray.byteLength
  const outputBufferSize = 8

  const inputBuffer = device.createBuffer({
    size: inputBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    mappedAtCreation: true,
  })
  new Int32Array(inputBuffer.getMappedRange()).set(inputArray)
  inputBuffer.unmap()

  const outputBuffer = device.createBuffer({
    size: outputBufferSize,
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
  })

  const stagingBuffer = device.createBuffer({
    size: outputBufferSize,
    usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
  })

  const shaderModule = device.createShaderModule({ code })

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'read-only-storage' },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.COMPUTE,
        buffer: { type: 'storage' },
      },
    ],
  })

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      { binding: 0, resource: { buffer: inputBuffer } },
      { binding: 1, resource: { buffer: outputBuffer } },
    ],
  })

  const computePipeline = device.createComputePipeline({
    layout: device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
    compute: {
      module: shaderModule,
      entryPoint: 'main',
    },
  })

  const execute = async () => {
    const commandEncoder = device.createCommandEncoder()
    const computePass = commandEncoder.beginComputePass()
    computePass.setPipeline(computePipeline)
    computePass.setBindGroup(0, bindGroup)
    computePass.dispatchWorkgroups(1)
    computePass.end()

    commandEncoder.copyBufferToBuffer(outputBuffer, 0, stagingBuffer, 0, outputBufferSize)
    device.queue.submit([commandEncoder.finish()])

    await stagingBuffer.mapAsync(GPUMapMode.READ)
    const result = [...new Int32Array(stagingBuffer.getMappedRange())]

    stagingBuffer.unmap()
    inputBuffer.destroy()
    outputBuffer.destroy()
    stagingBuffer.destroy()
    return result
  }

  return execute()
}
