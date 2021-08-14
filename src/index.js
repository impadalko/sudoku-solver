const solveButton = document.getElementById('solve-button')

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    const cell = document.getElementById(`cell-${i}-${j}`)
    cell.addEventListener('input', (e) => {
      if (!e.currentTarget.innerHTML.match(/^[1-9]?<br>$/)) e.currentTarget.classList.add('invalid')
      else e.currentTarget.classList.remove('invalid')

      if (document.querySelector('.invalid')) solveButton.setAttribute('disabled', true)
      else solveButton.removeAttribute('disabled')
    })
  }
}

const grid = Array.from(Array(9), () => new Array(9).fill(0))

solveButton.addEventListener('click', () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
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

const isValidGrid = (grid) => {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (grid[i][j] !== 0 && !isValidCell(grid, i, j, grid[i][j])) return false
  return true
}

const solve = async (grid) => {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (grid[i][j] === 0) {
        for (let k = 1; k <= 9; k++) {
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

const isValidCell = (grid, row, col, candidate) => {
  for (let i = 0; i < 9; i++)
    if (i !== row && grid[i][col] !== 0 && grid[i][col] === candidate) return false
  for (let i = 0; i < 9; i++)
    if (i !== col && grid[row][i] !== 0 && grid[row][i] === candidate) return false
  const squareRow = Math.floor(row / 3)
  const squareCol = Math.floor(col / 3)
  for (let i = 0; i < 9; i++) {
    const l = 3 * squareRow + Math.floor(i / 3)
    const k = 3 * squareCol + (i % 3)
    if (l === row && k === col) continue
    if (grid[l][k] !== 0 && grid[l][k] === candidate) return false
  }
  return true
}
