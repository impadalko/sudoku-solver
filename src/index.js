let gridSize = 9
let squareSize = 3
let grid = Array.from(Array(gridSize), () => new Array(gridSize).fill(0))

const solveButton = document.getElementById('solve-button')

const createGrid = () => {
  grid = Array.from(Array(gridSize), () => new Array(gridSize).fill(0))
  solveButton.removeAttribute('disabled')
  const table = document.getElementById('sudoku-grid')
  table.innerHTML = ''
  for (let i = 0; i < gridSize; i++) {
    const row = table.insertRow()
    for (let j = 0; j < gridSize; j++) {
      const cell = row.insertCell()
      cell.setAttribute('id', `cell-${i}-${j}`)
      cell.setAttribute('contenteditable', '')
      if (i === 0) cell.classList.add('border-top')
      if (j === 0) cell.classList.add('border-left')
      if (i % squareSize === squareSize - 1) cell.classList.add('border-bottom')
      if (j % squareSize === squareSize - 1) cell.classList.add('border-right')
      cell.innerHTML = '<br>'
      cell.addEventListener('input', (e) => {
        const regex = gridSize === 9 ? /^[1-9]?<br>$/ : /^([1-9]|1[0-6])?<br>$/
        if (!e.currentTarget.innerHTML.match(regex)) e.currentTarget.classList.add('invalid')
        else e.currentTarget.classList.remove('invalid')

        if (document.querySelector('.invalid')) solveButton.setAttribute('disabled', true)
        else solveButton.removeAttribute('disabled')
      })
    }
  }
}

createGrid()

for (const el of document.querySelectorAll('input[type=radio][name=size]')) {
  el.addEventListener('change', (e) => {
    gridSize = parseInt(e.currentTarget.value, 10)
    squareSize = Math.sqrt(gridSize)
    document.querySelector(':root').style.setProperty('--grid-size', `${432 / gridSize}px`)
    createGrid()
  })
}

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

const isValidGrid = (grid) => {
  for (let i = 0; i < gridSize; i++)
    for (let j = 0; j < gridSize; j++)
      if (grid[i][j] !== 0 && !isValidCell(grid, i, j, grid[i][j])) return false
  return true
}

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

const isValidCell = (grid, row, col, candidate) => {
  for (let i = 0; i < gridSize; i++)
    if (i !== row && grid[i][col] !== 0 && grid[i][col] === candidate) return false
  for (let i = 0; i < gridSize; i++)
    if (i !== col && grid[row][i] !== 0 && grid[row][i] === candidate) return false
  const squareRow = Math.floor(row / squareSize)
  const squareCol = Math.floor(col / squareSize)
  for (let i = 0; i < gridSize; i++) {
    const l = squareSize * squareRow + Math.floor(i / squareSize)
    const k = squareSize * squareCol + (i % squareSize)
    if (l === row && k === col) continue
    if (grid[l][k] !== 0 && grid[l][k] === candidate) return false
  }
  return true
}
