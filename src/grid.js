const solveButton = document.getElementById('solve-button')

const valueValidator = (gridSize) => {
  const regex = gridSize === 9 ? /^[1-9]?<br>$/ : /^([1-9]|1[0-6])?<br>$/
  return (e) => {
    if (!e.currentTarget.innerHTML.match(regex)) e.currentTarget.classList.add('invalid')
    else e.currentTarget.classList.remove('invalid')

    if (document.querySelector('.invalid')) solveButton.setAttribute('disabled', true)
    else solveButton.removeAttribute('disabled')
  }
}

// TODO: move this to a class
export const createGrid = (gridSize) => {
  const squareSize = Math.sqrt(gridSize)
  const grid = Array.from(Array(gridSize), () => new Array(gridSize).fill(0))
  solveButton.removeAttribute('disabled')
  const table = document.getElementById('sudoku-grid')
  table.innerHTML = ''

  const inputValidator = valueValidator(gridSize)
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
      cell.addEventListener('input', inputValidator)
    }
  }
  return grid
}
