const statusDisplay = document.querySelector('.gameStatus');

let dati;
let finish = 0;
let gameActive = true;
let currentPlayer = "";
let gameState = [];

const winningMessage = () => `Il giocatore "${currentPlayer}" ha vinto!`;
const drawMessage = () => `Partita finita in pareggio!`;
const currentPlayerTurn = () => `È il turno del giocatore: "${currentPlayer}"`;



statusDisplay.innerHTML = currentPlayerTurn();

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

function post(){    
    fetch("http://localhost:3000/dati",
    {
        method: "PUT",
        body: JSON.stringify({
            gameActive,
            currentPlayer,
            gameState
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

async function starterFunction(){
    let response = await fetch("http://localhost:3000/dati");
    dati = await response.json();
    gameState = dati.gameState;
    currentPlayer = dati.currentPlayer;
    if(!gameActive){
        handleResultValidation();
    }
    let cont = 0;
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = gameState[cont];
        cont++;
    })
}

async function handleCellPlayed(cell, cellIndex) {
    let response = await fetch("http://localhost:3000/dati");
    dati = await response.json();
    gameState = dati.gameState;
    currentPlayer = dati.currentPlayer;
    if (gameState[cellIndex] !== "" || !gameActive) {
        return;
    }
    gameState[cellIndex] = currentPlayer;
    cell.innerHTML = currentPlayer;
    handleResultValidation();
    post();
}

function handlePlayerChange() {
    if(currentPlayer === "X"){
        currentPlayer = "O";
    }else{
        currentPlayer = "X";
    }
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }

    handlePlayerChange();
}

function restartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "")
    post();
}
 