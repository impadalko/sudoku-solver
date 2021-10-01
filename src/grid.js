export class Grid {
  constructor(gridSize) {
    this.gridSize = gridSize
    this.squareSize = Math.sqrt(gridSize)
    this.data = Array.from(Array(gridSize), () => new Array(gridSize).fill(0))
    this.cells = Array.from(Array(gridSize), () => new Array(gridSize))

    const solveButton = document.getElementById('solve-button')
    solveButton.removeAttribute('disabled')
    const table = document.getElementById('sudoku-grid')
    table.innerHTML = ''

    const regex = this.gridSize === 9 ? /^[1-9]?<br>$/ : /^([1-9]|1[0-6])?<br>$/
    for (let i = 0; i < this.gridSize; i++) {
      const row = table.insertRow()
      for (let j = 0; j < this.gridSize; j++) {
        const cell = row.insertCell()
        this.cells[i][j] = cell
        cell.setAttribute('id', `cell-${i}-${j}`)
        cell.setAttribute('contenteditable', '')
        if (i === 0) cell.classList.add('border-top')
        if (j === 0) cell.classList.add('border-left')
        if (i % this.squareSize === this.squareSize - 1) cell.classList.add('border-bottom')
        if (j % this.squareSize === this.squareSize - 1) cell.classList.add('border-right')
        cell.innerHTML = '<br>'
        cell.addEventListener('input', (e) => {
          if (!e.currentTarget.innerHTML.match(regex)) e.currentTarget.classList.add('invalid')
          else {
            e.currentTarget.classList.remove('invalid')
            this.data[i][j] = Number.parseInt(e.currentTarget.innerText.replace('\n', '')) || 0
          }

          if (document.querySelector('.invalid')) solveButton.setAttribute('disabled', true)
          else solveButton.removeAttribute('disabled')
        })
      }
    }
  }

  lock() {
    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++) {
        const cell = this.cells[i][j]
        cell.innerHTML = `<b>${cell.innerHTML}</b>`
        cell.removeAttribute('contenteditable')
      }
  }

  isValid() {
    for (let i = 0; i < this.gridSize; i++)
      for (let j = 0; j < this.gridSize; j++)
        if (this.data[i][j] !== 0 && !this.isValidCell(i, j, this.data[i][j])) return false
    return true
  }

  isValidCell(row, col, candidate) {
    for (let i = 0; i < this.gridSize; i++)
      if (i !== row && this.data[i][col] === candidate) return false
    for (let i = 0; i < this.gridSize; i++)
      if (i !== col && this.data[row][i] === candidate) return false

    const squareRow = this.squareSize * Math.floor(row / this.squareSize)
    const squareCol = this.squareSize * Math.floor(col / this.squareSize)
    for (let i = 0; i < this.gridSize; i++) {
      const l = squareRow + Math.floor(i / this.squareSize)
      const k = squareCol + (i % this.squareSize)
      if (!(l === row && k === col) && this.data[l][k] === candidate) return false
    }
    return true
  }

  updateCell(row, col, value) {
    this.data[row][col] = value
    this.cells[row][col].innerHTML = `${value ? value : ''}<br>`
  }
}
