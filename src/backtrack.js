const backtrack = async (grid) => {
  for (let i = 0; i < grid.gridSize; i++)
    for (let j = 0; j < grid.gridSize; j++)
      if (grid.data[i][j] === 0) {
        for (let k = 1; k <= grid.gridSize; k++) {
          if (grid.isValidCell(i, j, k)) {
            // Attempt to solve by setting cell[i][j] to k and recursing
            grid.updateCell(i, j, k)
            // Add sleep to better show the backtracking to the user
            await new Promise((r) => setTimeout(r, 50))
            if (await backtrack(grid)) return true
            // Rollback if cannot solve with this value
            grid.updateCell(i, j, 0)
          }
        }
        return false
      }
  return true
}

export default backtrack
