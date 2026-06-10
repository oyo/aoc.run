const domItem = (p) => (p instanceof HTMLElement || p instanceof SVGElement ? p : p.view)

export const isJSON = (o) => {
  try {
    return JSON.parse(o)
  } catch (_) {
    return false
  }
}

export const json = (o) => JSON.stringify(o, null, 2)

export const append = (n, c) => {
  for (let cn of Array.isArray(c) ? c : [c]) {
    try {
      let m = domItem(cn)
      if (m) {
        n.appendChild(m)
        continue
      }
      m = String(cn)
      if (m !== '[object Object]') {
        n.appendChild(document.createTextNode(m))
        continue
      }
      throw e
    } catch (e) {
      const pre = document.createElement('pre')
      pre.appendChild(document.createTextNode(json(cn) ?? String(cn)))
      n.appendChild(pre)
    }
  }
  return n
}

export const N = (tag, c, att) => {
  const n = document.createElement(tag)
  if (att) for (let a of Object.keys(att)) n.setAttribute(a, att[a])
  if (typeof c === 'undefined' || c === null || c === false) return n
  return append(n, c)
}

export const remove = (n) => {
  try {
    n.parentElement.removeChild(n)
  } catch (_) {
    // ignore
  }
}

export const clear = (n) => {
  const d = domItem(n)
  if (!d) return
  while (d.childNodes.length > 0) d.removeChild(d.firstChild)
  return n
}

export const addEvents = (node, evts) => {
  Object.keys(evts).forEach((key) => node.addEventListener(key, evts[key]))
  return node
}

export function debounce(func, timeout = 250) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func.apply(this, args), timeout)
  }
}

export /*abstract*/ class Viewable {
  constructor(view) {
    this.view = typeof view === 'string' ? document.querySelector(view) : view
  }

  getView() {
    return this.view
  }

  clear() {
    clear(this.getView())
    return this
  }

  append(p) {
    append(this.getView(), p)
    return this
  }

  appendTo(p) {
    append(domItem(p), this.getView())
    return this
  }

  remove() {
    remove(this.getView())
  }
}

export class Div extends Viewable {
  constructor(c, a) {
    super(N('div', c, a))
  }
}
export class Span extends Viewable {
  constructor(c, a) {
    super(N('span', c, a))
  }
}
export class P extends Viewable {
  constructor(c, a) {
    super(N('p', c, a))
  }
}
export class A extends Viewable {
  constructor(c, a) {
    super(N('a', c, a))
  }
}
export class H1 extends Viewable {
  constructor(c, a) {
    super(N('h1', c, a))
  }
}
export class Ul extends Viewable {
  constructor(c, a) {
    super(N('ul', c, a))
  }
}
export class Li extends Viewable {
  constructor(c, a) {
    super(N('li', c, a))
  }
}
export class Pre extends Viewable {
  constructor(c, a) {
    super(N('pre', c, a))
  }
}
export class Button extends Viewable {
  constructor(c, a) {
    super(N('button', c, a))
  }
}
