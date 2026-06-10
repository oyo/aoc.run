const N = (n) => Number.parseInt(n)

export const P = {
  prep: (T) =>
    T.trim()
      .split('\n')
      .map((L) => L.split(',').map(N)),

  isInsideRect: (r1, r2, p) => p[0] > r1[0] && p[0] < r2[0] && p[1] > r1[1] && p[1] < r2[1],

  checkIntersect: (r1, r2, l1, l2) => {
    const minr = [Math.min(r1[0], r2[0]), Math.min(r1[1], r2[1])]
    const maxr = [Math.max(r1[0], r2[0]), Math.max(r1[1], r2[1])]
    const minl = [Math.min(l1[0], l2[0]), Math.min(l1[1], l2[1])]
    const maxl = [Math.max(l1[0], l2[0]), Math.max(l1[1], l2[1])]
    const l1i = P.isInsideRect(minr, maxr, l1)
    const l2i = P.isInsideRect(minr, maxr, l2)
    if (l1i || l2i) return true
    if (minl[0] === maxl[0]) {
      // horizontal line
      let y = minl[0]
      const c = y > minr[0] && y < maxr[0] && minl[1] <= minr[1] && maxl[1] >= maxr[1]
      //console.log(minr, maxr, minl, maxl, c)
      return c
    }
    if (minl[1] === maxl[1]) {
      // vertical line
      let x = minl[1]
      if (x > minr[1] && x < maxr[1] && minl[0] <= minr[0] && maxl[0] >= maxr[0]) return true
    }
    return false
  },

  part_1: (T) => {
    const p = P.prep(T)
    let max = [-Infinity, 0, 0]
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const [x1, y1] = p[i]
        const [x2, y2] = p[j]
        let dx = Math.abs(x2 - x1) + 1
        let dy = Math.abs(y2 - y1) + 1
        let area = dx * dy
        if (area > max[0]) {
          max[0] = area
          max[1] = i
          max[2] = j
        }
      }
    }
    return max
  },

  part_2: (T) => {
    const p = P.prep(T)
    let max = [-Infinity, 0, 0]
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const [x1, y1] = p[i]
        const [x2, y2] = p[j]
        let dx = Math.abs(x2 - x1) + 1
        let dy = Math.abs(y2 - y1) + 1
        let area = dx * dy
        if (area > max[0]) {
          let intersect = false
          for (let k = 0; k < p.length && !intersect; k++) {
            let pl1 = p[k]
            let pl2 = p[(k + 1) % p.length]
            intersect = P.checkIntersect(p[i], p[j], pl1, pl2)
            //console.log('check', p[i], p[j], pl1, pl2, '=>', intersect)
          }
          if (!intersect) {
            max[0] = area
            max[1] = i
            max[2] = j
          }
        }
      }
    }
    return max
  },

  getData: () => P.data,

  step: () => {},

  init: (T) => {
    const data = P.prep(T)
    P.data = {
      data,
      max1: P.part_1(T),
      max2: P.part_2(T),
    }
    return P
  },
}

class QuadModel {
  col = { r: 1, g: 0.7, b: 0.5 }
  shade = { xm: 0.5, xp: 0.6, ym: 0.3, yp: 0.9, zm: 0.4, zp: 0.8 }

  constructor() {
    this.clear()
  }

  clear() {
    this.l = 0
    this.v = []
    this.c = []
    //this.axes()
  }

  axes() {
    this.v.push(0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 0, 0, 0)
    this.c.push(
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0,
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0,
      0.5,
      0,
      0,
      0.5,
      0,
      0,
      0.5,
    )
  }

  quadXM(x, y, z, c) {
    c ||= this.col
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y, z1, x, y1, z1, x, y, z, x, y1, z1, x, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadXP(x, y, z, c) {
    c ||= this.col
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z1, x, y, z1, x, y, z, x, y1, z, x, y1, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYM(x, y, z, c) {
    c ||= this.col
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.ym,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z, x1, y, z1, x, y, z, x1, y, z1, x, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYP(x, y, z, c) {
    c ||= this.col
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.yp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z1, x1, y, z, x, y, z, x, y, z1, x1, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZM(x, y, z, c) {
    c ||= this.col
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z, x1, y1, z, x, y, z, x1, y1, z, x1, y, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZP(x, y, z, c) {
    c ||= this.col
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y1, z, x, y1, z, x, y, z, x1, y, z, x1, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  line(x, y, z, x1, y1, z1, c) {
    c ||= this.col
    this.v.push(x, y, z, x1, y1, z1, x, y, z)
    this.c.push(c.r, c.g, c.b, c.r, c.g, c.b, c.r, c.g, c.b)
    this.l++
  }

  cubeAt(x, y, z, c) {
    this.quadXP(x + 0.5, y - 0.5, z - 0.5, c)
    this.quadYP(x - 0.5, y + 0.5, z - 0.5, c)
    this.quadZP(x - 0.5, y - 0.5, z + 0.5, c)
    this.quadXM(x - 0.5, y - 0.5, z - 0.5, c)
    this.quadYM(x - 0.5, y - 0.5, z - 0.5, c)
    this.quadZM(x - 0.5, y - 0.5, z - 0.5, c)
  }
}

class Scene extends QuadModel {
  listener = []

  constructor() {
    super()
  }

  setModel(model) {
    this.model = model
    this.create()
    this.fireSceneChanged()
    return this
  }

  create() {
    this.clear()
    let { data, max1, max2 } = this.model.getData()
    //console.log(max1, max2)
    const cl = { r: 0.9, g: 0.9, b: 0.9 }
    const cr = { r: 0.8, g: 0.2, b: 0.2 }
    const cg = { r: 0.1, g: 0.5, b: 0.1 }
    const cs = { r: 0.8, g: 0.5, b: 0.1 }
    data = data.map((p) => p.map((a) => (a - 50000) / 1000))
    data.forEach((p, i) => {
      const [y, x] = p
      const [y1, x1] = data[(i + 1) % data.length]
      this.line(x, y, 0, x1, y1, 0, cs)
    })
    const [y10, x10] = data[max1[1]]
    const [y11, x11] = data[max1[2]]
    const [y20, x20] = data[max2[1]]
    const [y21, x21] = data[max2[2]]
    {
      this.line(x10, y10, 1, x10, y11, 1, cg)
      this.line(x10, y11, 1, x11, y11, 1, cg)
      this.line(x11, y11, 1, x11, y10, 1, cg)
      this.line(x11, y10, 1, x10, y10, 1, cg)
    }
    {
      this.line(x20, y20, 2, x20, y21, 2, cr)
      this.line(x20, y21, 2, x21, y21, 2, cr)
      this.line(x21, y21, 2, x21, y20, 2, cr)
      this.line(x21, y20, 2, x20, y20, 2, cr)
    }
    this.cubeAt(x10, y10, 1, cs)
    this.cubeAt(x11, y11, 1, cs)
    this.cubeAt(x20, y20, 2, cs)
    this.cubeAt(x21, y21, 2, cs)

    data.forEach(([y, x]) => this.cubeAt(x, y, -1, cl))

    this.fireSceneChanged()
  }

  addListener(l) {
    this.listener.push(l)
    return this
  }

  fireSceneChanged() {
    for (let l of this.listener) if (l.sceneChanged) l.sceneChanged(this)
  }
}

class AnimatedScene extends Scene {
  speed = 10000

  constructor() {
    super()
  }

  start() {
    this.stop()
    this.timer = setInterval(this.step.bind(this), this.speed)
    return this
  }

  stop() {
    if (this.timer) clearInterval(this.timer)
    return this
  }

  step() {
    if (!this.model) return this
    this.model.step()
    this.create()
    this.fireSceneChanged()
    return this
  }
}

let gl
class Simple3D {
  cam = { fov: 16 }
  pos = { x: 0, y: 0, z: -300 }
  rot = { x: 0, y: 0 /*, z: 0*/ }
  col = { r: 0.7, g: 0.9, b: 1, a: 1 } //{ r: 0.059, g: 0.059, b: 0.137, a: 1 }//{ r: 0, g: 0.1, b: 0.25, a: 1 } // { r: 0.9, g: 0.95, b: 1, a: 1 }
  rMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  mode = true
  uniRM = false

  constructor() {
    this.view = this.canvas = document.createElement('canvas')
    try {
      gl = this.canvas.getContext('webgl2')
    } catch (e) {
      alert('WebGL not initialized!')
    }
    gl.clearColor(this.col.r, this.col.g, this.col.b, this.col.a)
    gl.clearDepth(1)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.depthFunc(gl.LEQUAL)
    //document.body.appendChild(this.canvas)
    this.initShaders()
    this.resize()
    window.addEventListener('resize', this.requestResize.bind(this))
  }

  initShaders() {
    const sh = gl.createProgram()
    gl.attachShader(
      sh,
      this.getShader(
        gl,
        gl.VERTEX_SHADER,
        `#version 300 es
in vec3 aPos;
in vec4 aCol;
uniform mat4 uMVMatrix,uPMatrix;
out vec4 vColor;
void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aPos, 1.0);
  vColor = aCol;
}`,
      ),
    )
    gl.attachShader(
      sh,
      this.getShader(
        gl,
        gl.FRAGMENT_SHADER,
        `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 fragColor;
void main(void) {
    fragColor = vColor;
}`,
      ),
    )
    gl.linkProgram(sh)
    if (!gl.getProgramParameter(sh, gl.LINK_STATUS)) alert('Shaders not initialized!')
    gl.useProgram(sh)
    this.vertexPositionAttribute = gl.getAttribLocation(sh, 'aPos')
    this.vertexColorAttribute = gl.getAttribLocation(sh, 'aCol')
    this.uniRM = gl.getUniformLocation(sh, 'uMVMatrix')
    this.shader = sh
    gl.enableVertexAttribArray(this.vertexPositionAttribute)
    gl.enableVertexAttribArray(this.vertexColorAttribute)
  }

  getShader(gl, type, source) {
    const s = gl.createShader(type)
    gl.shaderSource(s, source)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
      alert('GLSL compile error:\n' + gl.getShaderInfoLog(s))
    return s
  }

  perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan((fov * Math.PI) / 360)
    const ri = 1 / (near - far)
    return [
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      (near + far) * ri,
      -1,
      0,
      0,
      near * far * ri * 2,
      0,
    ]
  }

  render() {
    if (!this.scene) return
    const cx = Math.cos(this.rot.x),
      sx = Math.sin(this.rot.x),
      cy = Math.cos(this.rot.y),
      sy = Math.sin(this.rot.y),
      r = this.rMatrix
    r[0] = cy
    r[1] = sx * sy
    r[2] = -cx * sy
    r[5] = cx
    r[6] = sx
    r[8] = sy
    r[9] = -sx * cy
    r[10] = cx * cy
    r[12] = this.pos.x
    r[13] = this.pos.y
    r[14] = this.pos.z
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.uniformMatrix4fv(this.uniRM, false, r)
    gl.drawArrays(gl.LINES, 0, this.scene.l * 3)
    gl.drawArrays(this.mode ? gl.TRIANGLES : gl.LINES, 0, this.numItems)
  }

  requestResize() {
    clearTimeout(this.resizeTimer)
    this.resizeTimer = setTimeout(this.resize.bind(this), 200)
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
    this.pMatrix = new Float32Array(
      this.perspective(this.cam.fov, this.canvas.width / this.canvas.height, 0.5, 1000),
    )
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.uniformMatrix4fv(gl.getUniformLocation(this.shader, 'uPMatrix'), false, this.pMatrix)
    this.change = true
    this.render()
  }

  arrayToBuffer(arr, itemSize, ptr) {
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW)
    buf.itemSize = itemSize
    buf.numItems = arr.length / buf.itemSize
    gl.vertexAttribPointer(ptr, buf.itemSize, gl.FLOAT, false, 0, 0)
    return buf
  }

  setScene(scene) {
    this.scene = scene
    this.arrayToBuffer(scene.c, 3, this.vertexColorAttribute)
    this.numItems = this.arrayToBuffer(scene.v, 3, this.vertexPositionAttribute).numItems
    this.render()
    return this
  }

  updatePos(c) {
    this.pos.x += c[0]
    this.pos.y += c[1]
    this.pos.z += c[2]
    if (this.pos.z > -2) this.pos.z = -2
    this.render()
    return this
  }

  updateRot(r) {
    this.rot.y += r[0] / 360
    this.rot.x += r[1] / 360
    if (this.rot.x > Math.PI / 2) this.rot.x = Math.PI / 2
    else if (this.rot.x < -Math.PI / 2) this.rot.x = -Math.PI / 2
    this.render()
    return this
  }
}

class UserInput {
  mouse = { button: false, x: 0, y: 0, u: 0, v: 0, w: 60, max: 70 }
  keyMask = 0
  listener = []

  constructor(parent) {
    parent.setAttribute('tabindex', 1)
    parent.addEventListener('mousedown', this.mouseDown.bind(this))
    parent.addEventListener('mouseup', this.mouseUp.bind(this))
    parent.addEventListener('mouseout', this.mouseUp.bind(this))
    parent.addEventListener('mousemove', this.mouseMove.bind(this))
    parent.addEventListener('keydown', this.keyDown.bind(this))
    parent.addEventListener('keyup', this.keyUp.bind(this))
    parent.addEventListener('DOMMouseScroll', this.mouseWheel.bind(this))
    parent.addEventListener('mousewheel', this.mouseWheel.bind(this))
    parent.addEventListener('touchstart', this.touch2Mouse.bind(this), true)
    parent.addEventListener('touchmove', this.touch2Mouse.bind(this), true)
    parent.addEventListener('touchend', this.touch2Mouse.bind(this), true)
    this.mouseUp()
  }

  touch2Mouse(evt) {
    const touch = evt.changedTouches[0]
    let mouseEv
    switch (evt.type) {
      case 'touchstart':
        mouseEv = 'mousedown'
        break
      case 'touchend':
        mouseEv = 'mouseup'
        break
      case 'touchmove':
        mouseEv = 'mousemove'
        break
      default:
        return
    }
    var mouseEvent = document.createEvent('MouseEvent')
    mouseEvent.initMouseEvent(
      mouseEv,
      true,
      true,
      window,
      1,
      touch.screenX << 1,
      touch.screenY << 1,
      touch.clientX << 1,
      touch.clientY << 1,
      false,
      false,
      false,
      false,
      0,
      null,
    )
    touch.target.dispatchEvent(mouseEvent)
    evt.preventDefault()
  }

  mouseWheel(evt) {
    this.fireZoomChanged(evt.deltaY)
  }

  mouseMove(evt) {
    if (!this.mouse.button) return
    this.mouse.u = evt.clientX - this.mouse.x
    this.mouse.v = evt.clientY - this.mouse.y
    if (this.mouse.u > this.mouse.max) this.mouse.u = this.mouse.max
    else if (this.mouse.u < -this.mouse.max) this.mouse.u = -this.mouse.max
    if (this.mouse.v > this.mouse.max) this.mouse.v = this.mouse.max
    else if (this.mouse.v < -this.mouse.max) this.mouse.v = -this.mouse.max
    this.move()
    this.mouse.x = evt.clientX
    this.mouse.y = evt.clientY
  }

  slowDown() {
    this.mouse.u *= 0.98
    this.mouse.v *= 0.9
    this.mouse.w *= 0.9
    let stop = true
    if (this.mouse.u > 1 || this.mouse.v > 1 || this.mouse.u < -1 || this.mouse.v < -1) {
      this.move()
      stop = false
    }
    if (this.mouse.w > 1 || this.mouse.w < -1) {
      this.fireZoomChanged(this.mouse.w)
      stop = false
    }
    if (stop) clearInterval(this.slowDownTimer)
  }

  move() {
    this.fireMouseChanged(this.mouse)
  }

  mouseDown(evt) {
    this.mouse.button = true
    this.mouse.x = evt.clientX
    this.mouse.y = evt.clientY
    this.mouse.u = 0
    this.mouse.v = 0
    clearInterval(this.slowDownTimer)
  }

  mouseUp(evt) {
    this.mouse.button = false
    if (this.slowDownTimer) clearInterval(this.slowDownTimer)
    this.slowDownTimer = setInterval(this.slowDown.bind(this), 20)
  }

  keyDown(evt) {
    switch (evt.keyCode) {
      case 78:
        this.createData()
        this.createScene()
        break
      case 84:
        this.color = !this.color
        this.createScene()
        break
      case 86:
        this.color = this.volume = !this.volume
        this.createScene()
        break
      case 87:
        this.mode = !this.mode
        break
      case 37:
        this.startKeyTimer(1)
        break
      case 40:
        this.startKeyTimer(2)
        break
      case 39:
        this.startKeyTimer(4)
        break
      case 38:
        this.startKeyTimer(8)
        break
      case 187:
        this.startKeyTimer(16)
        break
      case 189:
        this.startKeyTimer(32)
        break
    }
    this.change = true
  }

  keyUp(evt) {
    switch (evt.keyCode) {
      case 37:
        this.keyMask &= ~1
        break //left
      case 40:
        this.keyMask &= ~2
        break //down
      case 39:
        this.keyMask &= ~4
        break //right
      case 38:
        this.keyMask &= ~8
        break //up
      case 187:
        this.keyMask &= ~16
        break //+
      case 189:
        this.keyMask &= ~32
        break //-
    }
  }

  startKeyTimer(mask) {
    this.keyMask |= mask
    if (this.keyTimer) clearInterval(this.keyTimer)
    this.keyTimer = setInterval(this.processKeys.bind(this), 20)
  }

  processKeys() {
    if (this.keyMask === 0) {
      clearInterval(this.keyTimer)
      this.keyTimer = null
    }
    this.fireKeysChanged(this.keyMask)
  }

  addListener(l) {
    this.listener.push(l)
    return this
  }

  fireKeysChanged() {
    for (let l of this.listener) if (l.keysChanged) l.keysChanged(this.keyMask)
  }

  fireMouseChanged() {
    for (let l of this.listener) if (l.mouseChanged) l.mouseChanged(this.mouse)
  }

  fireZoomChanged(y) {
    for (let l of this.listener) if (l.mouseChanged) l.zoomChanged(y)
  }
}

export class Game {
  constructor(model) {
    this.output = new Simple3D()
    this.input = new UserInput(this.output.canvas).addListener(this)
    this.scene = new AnimatedScene().addListener(this).setModel(model)
  }

  keysChanged(keyMask) {
    const speed = 0.5
    const camEvent = [0, 0, 0]
    if (keyMask & 1) camEvent[0] = -speed
    if (keyMask & 2) camEvent[1] = -speed
    if (keyMask & 4) camEvent[0] = speed
    if (keyMask & 8) camEvent[1] = speed
    if (keyMask & 16) camEvent[2] = speed
    if (keyMask & 32) camEvent[2] = -speed
    this.output.updatePos(camEvent)
  }

  mouseChanged(vector) {
    this.output.updateRot([vector.u, vector.v])
  }

  zoomChanged(y) {
    this.output.updatePos([0, 0, -y * 0.2])
  }

  sceneChanged(scene) {
    this.output.setScene(scene)
  }
}

export const valid = (input) => /^((\d+,\d+)\n)+((\d+,\d+)\n?)$/.exec(input)
export const visual = (input) => new Game(P.init(input)).output.view
export const stop = () => {}
