# Advent of Code Solutions and Visualizations

Advent of Code is a popular code golfing competition.
This is a framework helping to solve, run and visualize the puzzles in JavaScript.

### Getting started

Install [vite+](https://viteplus.dev/) then

```bash
# install all dependencies
vp install
# run unit tests for all puzzles
vp test
# now set env var AOC_COOKIE as described below then
# run one of the puzzles with automated input download
vp run solve 2025 1
# start the development server
vp dev
# press o + enter or
open http://localhost:4000/aoc.run/
```

### Automate input download and solution submit

Set the Advent of Code session cookie as an environment variable.
This is very handy so you don't have to switch between browser windows and get
your input with a single click. Follow these steps (example here on Mac Google Chrome):

- open https://adventofcode.com/auth/login
- if not logged in, log in using any method
- open the browser's developer tools (right click -> 'Inspect', `Ctrl-Shift-I`, `⌥⌘I`, etc.)
- navigate to the 'Application' tab and select 'Storage' -> 'Cookies' -> 'https...'
- copy the 'session' value from there

Go to a terminal and set your value as environment variable

```bash
export AOC_COOKIE='session=<your copied cookie value>'

# recommend to add it to your .zshrc, .bashrc
echo export AOC_COOKIE='session=<your copied cookie value>' >> ~/.zshrc

# check if you can get some input
curl https://adventofcode.com/2015/day/1/input --cookie $AOC_COOKIE
# ()(((()))(()()()((((()(...

# now start the development server and get the input through local proxy
vp dev
open http://localhost:4000/aoc/2015/day/2/input
```

### Caveats

Code checks and linter are disabled, because due to the nature of the competition
coding speed goes before clean and readable code. For the same reason most variable
names are one letter only.
