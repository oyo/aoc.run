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

    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const width = window.innerWidth - margin.left - margin.right
    const height = window.innerHeight - margin.top - margin.bottom

    const root = d3.hierarchy(data).sum((d) => d.value || 1)

    d3.treemap().size([width, height]).padding(2)(root)

    const svg = d3
      .select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      .selectAll('rect')
      .data(root.leaves())
      .enter()
      .append('rect')
      .attr('x', (d) => d.x0)
      .attr('y', (d) => d.y0)
      .attr('width', (d) => d.x1 - d.x0)
      .attr('height', (d) => d.y1 - d.y0)
      .style('fill', 'slateblue')
  },
}

void P.load('../input')
