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
})
