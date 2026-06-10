const P = {
  prep: (T) => T.trim().split('\n').reverse(),

  prepEmpty: (d) =>
    new Array(d + 2)
      .fill(true)
      .map((z) => new Array(d + 2).fill(true).map((y) => new Array(d + 2).fill('.'))),

  populate: (dim, p) => {
    const board = P.prepEmpty(dim)
    const z0 = (dim >> 1) + 1
    const o = z0 - (p.length >> 1)
    for (let y = 0; y < p.length; y++) {
      for (let x = 0; x < p.length; x++) {
        board[z0][o + y][o + x] = p[y][x]
      }
    }
    return board
  },

  clone: (board) => board.slice().map((y) => y.slice().map((x) => x.slice())),

  count: (z) =>
    z.reduce((a, y) => a + y.reduce((b, x) => b + x.filter((c) => c === '#').length, 0), 0),

  adjacentCount: (p, z, y, x) =>
    (p[z - 1][y - 1][x - 1] === '#' ? 1 : 0) +
    (p[z - 1][y - 1][x] === '#' ? 1 : 0) +
    (p[z - 1][y - 1][x + 1] === '#' ? 1 : 0) +
    (p[z - 1][y][x - 1] === '#' ? 1 : 0) +
    (p[z - 1][y][x] === '#' ? 1 : 0) +
    (p[z - 1][y][x + 1] === '#' ? 1 : 0) +
    (p[z - 1][y + 1][x - 1] === '#' ? 1 : 0) +
    (p[z - 1][y + 1][x] === '#' ? 1 : 0) +
    (p[z - 1][y + 1][x + 1] === '#' ? 1 : 0) +
    (p[z][y - 1][x - 1] === '#' ? 1 : 0) +
    (p[z][y - 1][x] === '#' ? 1 : 0) +
    (p[z][y - 1][x + 1] === '#' ? 1 : 0) +
    (p[z][y][x - 1] === '#' ? 1 : 0) +
    (p[z][y][x + 1] === '#' ? 1 : 0) +
    (p[z][y + 1][x - 1] === '#' ? 1 : 0) +
    (p[z][y + 1][x] === '#' ? 1 : 0) +
    (p[z][y + 1][x + 1] === '#' ? 1 : 0) +
    (p[z + 1][y - 1][x - 1] === '#' ? 1 : 0) +
    (p[z + 1][y - 1][x] === '#' ? 1 : 0) +
    (p[z + 1][y - 1][x + 1] === '#' ? 1 : 0) +
    (p[z + 1][y][x - 1] === '#' ? 1 : 0) +
    (p[z + 1][y][x] === '#' ? 1 : 0) +
    (p[z + 1][y][x + 1] === '#' ? 1 : 0) +
    (p[z + 1][y + 1][x - 1] === '#' ? 1 : 0) +
    (p[z + 1][y + 1][x] === '#' ? 1 : 0) +
    (p[z + 1][y + 1][x + 1] === '#' ? 1 : 0),

  update: (counter, transposer) => {
    P.board.push(P.board.shift())
    const p = P.board[0]
    const p1 = P.board[1]
    for (let z = 1; z < P.D.z - 1; z++)
      for (let y = 1; y < P.D.y - 1; y++)
        for (let x = 1; x < P.D.x - 1; x++)
          p[z][y][x] = transposer(p1[z][y][x], counter(p1, z, y, x))
    return P
  },

  step: () =>
    P.update(P.adjacentCount, (s, c) => (s === '#' && (c < 2 || c > 3) ? '.' : c === 3 ? '#' : s)),

  getData: () => P.board[0],

  init: (T) => {
    const p = P.prep(T)
    const board = P.populate(31, p)
    P.D = {
      z: board.length - 2,
      y: board[0].length - 2,
      x: board[0][0].length - 2,
    }
    P.board = [P.clone(board), P.clone(board)]
    return P
  },
}

class QuadModel {
  col = { r: 1, g: 0.7, b: 0.5 }
  shade = { xm: 0.4, xp: 0.5, ym: 0.2, yp: 0.8, zm: 0.3, zp: 0.7 }

  constructor() {
    this.clear()
  }

  clear() {
    this.v = []
    this.c = []
  }

  quadXM(x, y, z, c) {
    c = c || this.col
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y, z1, x, y1, z1, x, y, z, x, y1, z1, x, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadXP(x, y, z, c) {
    c = c || this.col
    const y1 = y + 1,
      z1 = z + 1,
      f = this.shade.xp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z1, x, y, z1, x, y, z, x, y1, z, x, y1, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYM(x, y, z, c) {
    c = c || this.col
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.ym,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z, x1, y, z1, x, y, z, x1, y, z1, x, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadYP(x, y, z, c) {
    c = c || this.col
    const x1 = x + 1,
      z1 = z + 1,
      f = this.shade.yp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y, z1, x1, y, z, x, y, z, x, y, z1, x1, y, z1)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZM(x, y, z, c) {
    c = c || this.col
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zm,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x, y1, z, x1, y1, z, x, y, z, x1, y1, z, x1, y, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
  }

  quadZP(x, y, z, c) {
    c = c || this.col
    const x1 = x + 1,
      y1 = y + 1,
      f = this.shade.zp,
      s = [f * c.r, f * c.g, f * c.b]
    this.v.push(x, y, z, x1, y1, z, x, y1, z, x, y, z, x1, y, z, x1, y1, z)
    for (let i = 0; i < 6; i++) this.c.push(...s)
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
    const v = this.model.getData()
    const d = v.length
    const d2 = d / 2
    for (let z in v) {
      const z0 = z - d2
      const z1 = z0 + 1
      for (let y in v) {
        const y0 = y - d2
        const y1 = y0 + 1
        for (let x in v) {
          const x0 = x - d2
          const x1 = x0 + 1
          if (v[z][y][x] !== '.') {
            //const c = (v[z][y][x] === '#' ? { r: 1, g: 0.7, b: 0.5 } : { r: 1, g: 0.9, b: 0.3 })
            const c =
              Math.random() > 0.5
                ? { r: 1, g: 0.9, b: 0.3 } // gold
                : { r: 1, g: 0.4, b: 0 } // orange
            //: { r: 0.3, g: 0.8, b: 0 } // green
            //: { r: 0, g: 0.784, b: 1 } // lightblue
            this.quadXP(x1, y0, z0, c)
            this.quadYP(x0, y1, z0, c)
            this.quadZP(x0, y0, z1, c)
            this.quadXM(x0, y0, z0, c)
            this.quadYM(x0, y0, z0, c)
            this.quadZM(x0, y0, z0, c)
          }
        }
      }
    }
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
  speed = 5000

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
  cam = { fov: 60 }
  pos = { x: 0, y: 0, z: -1 }
  rot = { x: 0, y: 0 /*, z: 0*/ }
  col = { r: 0.059, g: 0.059, b: 0.137, a: 1 } //{ r: 0, g: 0.1, b: 0.25, a: 1 } // { r: 0.9, g: 0.95, b: 1, a: 1 }
  rMatrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  mode = true
  uniRM = false

  constructor() {
    this.canvas = document.createElement('canvas')
    try {
      gl = this.canvas.getContext('webgl')
    } catch (e) {
      alert('WebGL not initialized!')
    }
    gl.clearColor(this.col.r, this.col.g, this.col.b, this.col.a)
    gl.clearDepth(1)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.CULL_FACE)
    gl.depthFunc(gl.LEQUAL)
    document.body.appendChild(this.canvas)
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
        `attribute vec3 aPos;
attribute vec4 aCol;
uniform mat4 uMVMatrix,uPMatrix;
varying vec4 vColor;
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
        `varying lowp vec4 vColor;
void main(void) {
	gl_FragColor = vColor;
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
  mouse = { button: false, x: 0, y: 0, u: -45, v: 8, w: 20, max: 50 }
  keyMask = 0
  listener = []

  constructor() {
    document.addEventListener('mousedown', this.mouseDown.bind(this))
    document.addEventListener('mouseup', this.mouseUp.bind(this))
    document.addEventListener('mouseout', this.mouseUp.bind(this))
    document.addEventListener('mousemove', this.mouseMove.bind(this))
    document.addEventListener('keydown', this.keyDown.bind(this))
    document.addEventListener('keyup', this.keyUp.bind(this))
    document.addEventListener('DOMMouseScroll', this.mouseWheel.bind(this))
    document.addEventListener('mousewheel', this.mouseWheel.bind(this))
    this.mouseUp()
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
    if (this.mouse.w > 1 || this.mouse.w) {
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
    this.slowDownTimer = setInterval(this.slowDown.bind(this), 20)
  }

  keyDown(evt) {
    //console.log(evt.keyCode)
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
    if (this.keyTimer) return
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

class Game {
  constructor(model) {
    this.input = new UserInput().addListener(this)
    this.output = new Simple3D()
    this.scene = new AnimatedScene().addListener(this).setModel(model).start()
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
