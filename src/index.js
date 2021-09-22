import { Grid } from './grid.js'

let grid = new Grid(9)

for (const el of document.querySelectorAll('input[type=radio][name=size]')) {
  el.addEventListener('change', (e) => {
    const gridSize = parseInt(e.currentTarget.value, 10)
    document.querySelector(':root').style.setProperty('--grid-size', `${432 / gridSize}px`)
    grid = new Grid(gridSize)
  })
}

// TODO: Add algorithm selector and implement dancing links
const solveButton = document.getElementById('solve-button')
solveButton.addEventListener('click', (e) => {
  grid.lock()
  e.currentTarget.setAttribute('disabled', true)
  const status = document.getElementById(`status`)
  if (!grid.isValid()) {
    status.innerHTML = 'Cannot solve'
    return
  }
  status.innerHTML = 'Solving...'
  solve(grid).then((r) => {
    if (r) status.innerHTML = 'Solved'
    else status.innerHTML = 'Could not solve'
  })
})

const solve = async (grid) => {
  for (let i = 0; i < grid.gridSize; i++)
    for (let j = 0; j < grid.gridSize; j++)
      if (grid.data[i][j] === 0) {
        for (let k = 1; k <= grid.gridSize; k++) {
          if (grid.isValidCell(i, j, k)) {
            // Attempt to solve by setting cell[i][j] to k and recursing
            grid.updateCell(i, j, k)
            // Add sleep to better show the backtracking to the user
            await new Promise((r) => setTimeout(r, 50))
            if (await solve(grid)) return true
            // Rollback if cannot solve with this value
            grid.updateCell(i, j, 0)
          }
        }
        return false
      }
  return true
}
