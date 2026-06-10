import { N } from './nodeutil.js'

export default (data) =>
  document.body.appendChild(
    N(
      'table',
      [
        N('thead', N('tr', [N('th', ''), N('th', '*'), N('th', '**'), N('th', 'ms')])),
        N(
          'tbody',
          data.map((row) =>
            N('tr', [
              N('td', row[0]),
              N('td', row[1].result[0]),
              N('td', row[1].result[1]),
              N('td', Math.round(row[1].time * 1e3) / 1e3),
            ]),
          ),
        ),
      ],
      { class: 'output' },
    ),
  )
