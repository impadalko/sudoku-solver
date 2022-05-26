let id = 0

class Candidate {
  constructor(row, col, value) {
    this.row = row
    this.col = col
    this.value = value
  }
}

class BaseCell {
  constructor() {
    this.id = id++
    this.right = this
    this.left = this
    this.up = this
    this.down = this
  }

  addRight(cell) {
    this.right = cell
    cell.left = this
  }
}

class Cell extends BaseCell {
  constructor(candidate) {
    super()
    this.candidate = candidate
  }

  removeVertically() {
    this.up.down = this.down
    this.down.up = this.up
  }

  returnVertically() {
    this.up.down = this
    this.down.up = this
  }
}

class Column extends BaseCell {
  constructor() {
    super()
    this.size = 0
  }

  addUp(cell) {
    this.size++

    cell.up = this.up
    cell.down = this
    cell.up.down = cell
    this.up = cell
    cell.header = this
  }

  removeHorizontally() {
    this.left.right = this.right
    this.right.left = this.left
  }

  returnHorizontally() {
    this.left.right = this
    this.right.left = this
  }

  cover() {
    this.removeHorizontally()

    for (let p = this.down; p !== this; p = p.down)
      for (let q = p.right; q !== p; q = q.right) {
        q.removeVertically()
        q.header.size--
      }
  }

  uncover() {
    this.returnHorizontally()

    for (let p = this.up; p !== this; p = p.up)
      for (let q = p.left; q !== p; q = q.left) {
        q.returnVertically()
        q.header.size++
      }
  }
}

class Board {
  constructor(grid) {
    this.grid = grid
    this.gridSize = grid.gridSize
    this.squareSize = grid.squareSize

    const columnCount = 4 * Math.pow(this.gridSize, 2)
    this.columns = Array.from(Array(columnCount + 1), () => new Column())
    this.header = this.columns[0]
    for (let i = 0; i <= columnCount; i++) {
      const j = (i + 1) % this.columns.length
      this.columns[i].addRight(this.columns[j])
    }

    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++)
        for (let value = 1; value <= this.gridSize; value++) {
          const candidate = new Candidate(i, j, value)
          const posCell = new Cell(candidate)
          const rowCell = new Cell(candidate)
          const colCell = new Cell(candidate)
          const squareCell = new Cell(candidate)

          posCell.addRight(rowCell)
          rowCell.addRight(colCell)
          colCell.addRight(squareCell)
          squareCell.addRight(posCell)

          this.columns[this.positionConstraint(i, j)].addUp(posCell)
          this.columns[this.rowConstraint(i, value)].addUp(rowCell)
          this.columns[this.columnConstraint(j, value)].addUp(colCell)
          this.columns[this.squareConstraint(i, j, value)].addUp(squareCell)
        }

    // Remove the constraints that are already met by the user input
    // We could do this when first building the board, however this would make the logic harder to
    // understand without real improvements to code performance
    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++) {
        const value = grid.data[i][j]
        if (value !== 0) {
          this.columns[this.positionConstraint(i, j)].cover()
          this.columns[this.rowConstraint(i, value)].cover()
          this.columns[this.columnConstraint(j, value)].cover()
          this.columns[this.squareConstraint(i, j, value)].cover()
        }
      }
  }

  positionConstraint(row, col) {
    return row * this.gridSize + col + 1
  }

  rowConstraint(row, value) {
    return Math.pow(this.gridSize, 2) + row * this.gridSize + value
  }

  columnConstraint(col, value) {
    return 2 * Math.pow(this.gridSize, 2) + col * this.gridSize + value
  }

  squareConstraint(row, col, value) {
    const sqRow = this.squareSize * Math.floor(row / this.squareSize)
    const sqCol = this.squareSize * Math.floor(col / this.squareSize)
    const sqSize = this.squareSize
    return 3 * Math.pow(this.gridSize, 2) + (sqRow * sqSize + sqCol) * sqSize + value
  }

  async solve() {
    const column = this.selectColumn()
    if (column === null) return true
    column.cover()
    for (let p = column.down; p !== column; p = p.down) {
      this.grid.updateCell(p.candidate.row, p.candidate.col, p.candidate.value)
      for (let q = p.right; q !== p; q = q.right) q.header.cover()
      // Add sleep to better show the attempt to the user
      await new Promise((r) => setTimeout(r, 50))
      if (await this.solve()) return true
      for (let q = p.left; q !== p; q = q.left) q.header.uncover()
      this.grid.updateCell(p.candidate.row, p.candidate.col, 0)
    }
    column.uncover()

    return false
  }

  // Select the column with the least amount of possible values.
  // This is not needed by is used to make the recursion faster
  selectColumn() {
    let minSize = Infinity
    let column = null
    for (let p = this.header.right; p !== this.header; p = p.right) {
      if (p.size < minSize) {
        column = p
        minSize = p.size
      }
    }
    return column
  }
}

const dancingLinks = async (grid) => {
  const board = new Board(grid)
  return board.solve()
}

export default dancingLinks
