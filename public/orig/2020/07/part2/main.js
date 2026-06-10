const P = {
  load: (url) =>
    fetch(url)
      .then((response) => response.text())
      .then((input) => P.visualize(input)),

  prep: (T) =>
    T.split('\n')
      .map((L) =>
        L.split(/(s? contain )|(s?, )|(s?\.)/)
          .filter((b) => b && b.match(/^.*bag$/) && !b.match(/no other/))
          .map((b) => b.substring(0, b.length - 4))
          .flatMap((b) =>
            b.match(/^\d+ /)
              ? new Array(b.substring(0, 2).trim() * 1).fill(b.substring(2).trim())
              : b,
          ),
      )
      .reduce((b, a) => {
        b[a.shift()] = a
        return b
      }, {}),

  treeRek: (B, n) => ({
    name: n,
    children: B[n].map((b) => P.treeRek(B, b)),
  }),

  visualize: (input) => {
    const data = P.treeRek(P.prep(input), 'shiny gold')

    const size = Math.min(window.innerHeight, window.innerWidth)

    const svg = d3.select('body').append('svg').attr('width', size).attr('height', size)

    const margin = 20,
      diameter = +svg.attr('width'),
      g = svg.append('g').attr('transform', 'translate(' + diameter / 2 + ',' + diameter / 2 + ')')

    const color = d3
      .scaleLinear()
      .domain([-1, 5])
      .range(['hsl(152,80%,80%)', 'hsl(228,30%,40%)'])
      .interpolate(d3.interpolateHcl)

    const pack = d3
      .pack()
      .size([diameter - margin, diameter - margin])
      .padding(2)

    root = d3
      .hierarchy(data)
      .sum(function (d) {
        return 10
      })
      .sort(function (a, b) {
        return b.value - a.value
      })

    let focus = root
    const nodes = pack(root).descendants()
    let view = undefined

    const zoom = (d) => {
      let focus0 = focus
      focus = d

      const transition = d3
        .transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween('zoom', function (d) {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin])
          return function (t) {
            zoomTo(i(t))
          }
        })

      transition
        .selectAll('text')
        .filter(function (d) {
          return d.parent === focus || this.style.display === 'inline'
        })
        .style('fill-opacity', function (d) {
          return d.parent === focus ? 1 : 0
        })
        .on('start', function (d) {
          if (d.parent === focus) this.style.display = 'inline'
        })
        .on('end', function (d) {
          if (d.parent !== focus) this.style.display = 'none'
        })
    }

    const zoomTo = (v) => {
      const k = diameter / v[2]
      view = v
      node.attr('transform', function (d) {
        return 'translate(' + (d.x - v[0]) * k + ',' + (d.y - v[1]) * k + ')'
      })
      circle.attr('r', function (d) {
        return d.r * k
      })
    }

    const circle = g
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('class', function (d) {
        return d.parent ? (d.children ? 'node' : 'node node--leaf') : 'node node--root'
      })
      .style('fill', function (d) {
        return d.children ? color(d.depth) : null
      })
      .on('click', function (d) {
        if (focus !== d) (zoom(d), d3.event.stopPropagation())
      })

    const text = g
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .attr('class', 'label')
      .style('fill-opacity', function (d) {
        return d.parent === root ? 1 : 0
      })
      .style('display', function (d) {
        return d.parent === root ? 'inline' : 'none'
      })
      .text(function (d) {
        return d.data.name
      })

    const node = g.selectAll('circle,text')

    svg.style('background', color(-1)).on('click', function () {
      zoom(root)
    })

    zoomTo([root.x, root.y, root.r * 2 + margin])
  },
}

void P.load('../input')
