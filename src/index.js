import { createGrid } from './grid.js'
import { isValidCell, isValidGrid } from './valid.js'

let gridSize = 9
let grid = createGrid(gridSize)

for (const el of document.querySelectorAll('input[type=radio][name=size]')) {
  el.addEventListener('change', (e) => {
    gridSize = parseInt(e.currentTarget.value, 10)
    document.querySelector(':root').style.setProperty('--grid-size', `${432 / gridSize}px`)
    grid = createGrid(gridSize)
  })
}

const solveButton = document.getElementById('solve-button')
// TODO: Add algorithm selector and implement dancing links
solveButton.addEventListener('click', () => {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const cell = document.getElementById(`cell-${i}-${j}`)
      grid[i][j] = Number.parseInt(cell.innerText.replace('\n', '')) || 0
      cell.innerHTML = `<b>${cell.innerHTML}</b>`
      cell.removeAttribute('contenteditable')
    }
  }
  solveButton.setAttribute('disabled', true)
  const status = document.getElementById(`status`)
  if (!isValidGrid(grid)) {
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
  for (let i = 0; i < gridSize; i++)
    for (let j = 0; j < gridSize; j++)
      if (grid[i][j] === 0) {
        for (let k = 1; k <= gridSize; k++) {
          if (isValidCell(grid, i, j, k)) {
            const cell = document.getElementById(`cell-${i}-${j}`)
            // Attempt to solve by setting cell[i][j] to k and recursing
            grid[i][j] = k
            cell.innerHTML = `${k}<br>`
            // Add sleep to better show the backtracking to the user
            await new Promise((r) => setTimeout(r, 50))
            if (await solve(grid)) return true
            // Rollback if cannot solve with this value
            grid[i][j] = 0
            cell.innerHTML = '<br>'
          }
        }
        return false
      }
  return true
}
