let id = 0

class Cell {
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

  removeHorizontally() {
    this.left.right = this.right
    this.right.left = this.left
  }

  returnHorizontally() {
    this.left.right = this
    this.right.left = this
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

class ColumnHeader extends Cell {
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

  cover() {
    this.removeHorizontally()

    for (let p = this.down; p != this; p = p.down)
      for (let q = p.right; q != p; q = q.right) {
        q.removeVertically()
        q.header.size--
      }
  }

  uncover() {
    for (let p = this.up; p != this; p = p.up)
      for (let q = p.left; q != p; q = q.left) {
        q.header.size++
        q.returnVertically()
      }
    this.returnHorizontally()
  }
}

class DancingLinks {
  constructor(grid) {
    this.gridSize = grid.gridSize
    this.squareSize = grid.squareSize

    const columnCount = 4 * Math.pow(this.gridSize, 2)
    this.columns = Array.from(Array(columnCount + 1), () => new ColumnHeader())
    this.header = this.columns[0]
    for (let i = 0; i <= columnCount; i++) {
      const j = (i + 1) % this.columns.length
      this.columns[i].addRight(this.columns[j])
    }

    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++)
        for (let value = 1; value <= this.gridSize; value++) {
          const posCell = new Cell()
          const rowCell = new Cell()
          const colCell = new Cell()
          const squareCell = new Cell()

          posCell.addRight(rowCell)
          rowCell.addRight(colCell)
          colCell.addRight(squareCell)
          squareCell.addRight(posCell)

          this.columns[this.positionConstraint(i, j)].addUp(posCell)
          this.columns[this.rowConstraint(i, value)].addUp(rowCell)
          this.columns[this.columnConstraint(j, value)].addUp(colCell)
          this.columns[this.squareConstraint(i, j, value)].addUp(squareCell)
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
    const squareRow = this.squareSize * Math.floor(row / this.squareSize)
    const squareCol = this.squareSize * Math.floor(col / this.squareSize)
    return 3 * Math.pow(this.gridSize, 2) + squareRow * this.squareSize + squareCol + value
  }
}

const solve = async (grid) => {
  new DancingLinks(grid)
  return false
}

export default solve
