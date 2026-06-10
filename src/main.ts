import './style.css'
import { Viewable } from './aoc/ui.js'
import { TerminalView } from './components/TerminalView/index.js'

const cmd = new URLSearchParams(location.search).get('cmd') ?? 'help'
new Viewable('#app').append(await new TerminalView().execute(cmd))
