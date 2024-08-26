const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
let lineElement;

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || checkWinner()) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} has won!`;
        drawLine(checkWinner());
        return;
    } else if (!gameState.includes('')) {
        statusText.textContent = 'Draw!';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningCombination = null;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCombination = [a, b, c];
            break;
        }
    }

    return roundWon ? winningCombination : null;
}

function drawLine(winningCombination) {
    const [start, , end] = winningCombination;
    const startRect = cells[start].getBoundingClientRect();
    const endRect = cells[end].getBoundingClientRect();
    
    // Tentukan posisi awal dan akhir garis
    const x1 = startRect.left + startRect.width / 2;
    const y1 = startRect.top + startRect.height / 2;
    const x2 = endRect.left + endRect.width / 2;
    const y2 = endRect.top + endRect.height / 2;
    
    // Hitung panjang dan sudut garis
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // Buat elemen garis
    const lineElement = document.createElement('div');
    lineElement.classList.add('line');
    lineElement.style.width = `${length}px`;
    lineElement.style.transform = `rotate(${angle}deg)`;
    lineElement.style.position = 'absolute';
    lineElement.style.left = `${x1}px`;
    lineElement.style.top = `${y1}px`;
    
    document.body.appendChild(lineElement);
}


function resetGame() {
    currentPlayer = 'X';
    gameState = ['', '', '', '', '', '', '', '', ''];
    statusText.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');

    const lines = document.querySelectorAll('.line');
    lines.forEach(line => line.remove());
}


cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
