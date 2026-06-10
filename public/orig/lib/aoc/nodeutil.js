const getNodeOrViewable = (c) => (c.hasOwnProperty('view') ? c.view : c)

const getTextNode = (c, tc) => document.createTextNode(tc === 'string' ? c : '' + c)

export const append = (n, c) => {
  if (!(c instanceof Array)) c = [c]
  for (let i in c) {
    const tc = typeof c[i]
    if (tc !== 'undefined')
      try {
        n.appendChild(tc === 'object' ? getNodeOrViewable(c[i]) : getTextNode(c[i], tc))
      } catch (e) {
        const pre = document.createElement('pre')
        pre.appendChild(document.createTextNode(JSON.stringify(c[i], null, 4)))
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
