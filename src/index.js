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
  // TODO: Check if valid before attempting to solve
  // TODO: Display to the user if a solution was found
  solve(grid)
})

const solve = async (grid) => {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (grid[i][j] === 0) {
        for (let k = 1; k <= 9; k++) {
          if (isValid(grid, i, j, k)) {
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

const isValid = (grid, row, col, candidate) => {
  for (let i = 0; i < 9; i++) if (grid[i][col] !== 0 && grid[i][col] === candidate) return false
  for (let i = 0; i < 9; i++) if (grid[row][i] !== 0 && grid[row][i] === candidate) return false
  const squareRow = Math.floor(row / 3)
  const squareCol = Math.floor(col / 3)
  for (let i = 0; i < 9; i++) {
    const cell = grid[3 * squareRow + Math.floor(i / 3)][3 * squareCol + (i % 3)]
    if (cell !== 0 && cell === candidate) return false
  }
  return true
}
