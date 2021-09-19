export const isValidGrid = (grid) => {
  const gridSize = grid.length
  for (let i = 0; i < gridSize; i++)
    for (let j = 0; j < gridSize; j++)
      if (grid[i][j] !== 0 && !isValidCell(grid, i, j, grid[i][j])) return false
  return true
}

export const isValidCell = (grid, row, col, candidate) => {
  const gridSize = grid.length
  for (let i = 0; i < gridSize; i++) if (i !== row && grid[i][col] === candidate) return false
  for (let i = 0; i < gridSize; i++) if (i !== col && grid[row][i] === candidate) return false

  const squareSize = Math.sqrt(gridSize)
  const squareRow = Math.floor(row / squareSize)
  const squareCol = Math.floor(col / squareSize)
  for (let i = 0; i < gridSize; i++) {
    const l = squareSize * squareRow + Math.floor(i / squareSize)
    const k = squareSize * squareCol + (i % squareSize)
    if (!(l === row && k === col) && grid[l][k] === candidate) return false
  }
  return true
}
