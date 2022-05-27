import { Grid } from './grid.js'
import backtrack from './backtrack.js'
import dancingLinks from './dancingLinks.js'

let grid

const updateGrid = (el) => {
  const gridSize = parseInt(el.value, 10)
  const rootStyle = document.querySelector(':root').style
  rootStyle.setProperty('--grid-size', `${432 / gridSize}px`)
  rootStyle.setProperty('--font-size', `${Math.max(144 / gridSize, 16)}px`)
  grid = new Grid(gridSize)
}

for (const el of document.getElementsByName('size')) {
  if (el.checked) updateGrid(el)
  el.addEventListener('change', (e) => {
    updateGrid(e.currentTarget)
  })
}

let solve
const solveButton = document.getElementById('solve-button')
solveButton.addEventListener('click', (e) => {
  grid.lock()
  e.currentTarget.disabled = true
  document.querySelectorAll('input[type=radio]').forEach((e) => (e.disabled = true))
  solve = algorithmMap[document.querySelector('input[type=radio][name=algorithm]:checked').value]
  const status = document.getElementById(`status`)
  if (!grid.isValid()) {
    status.innerHTML = 'Cannot solve'
    return
  }
  status.innerHTML = 'Solving...'
  solve(grid).then((r) => {
    if (r) status.innerHTML = 'Solved'
    else status.innerHTML = 'Cannot solve'
  })
})

const algorithmMap = {
  backtrack,
  dancingLinks,
}
