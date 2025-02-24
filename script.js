const Gameboard = (function() {

    const board = [
                [null,null,null],
                [null,null,null],
                [null,null,null],
                ]

    const getBoard = () => {
        return board
    }

    const resetBoard = () => {
        board.forEach((row, idx) => {
            board[idx] = [null, null, null]
        })
    }

    const moveToBoard = (x, y, marker) => {
        if (board[x][y] !== null) return false
        board[x][y] = marker
        return true
    }

    const checkForWin = () => {

        const allEqual = (arr) => arr.every(val => val === arr[0] && val !== null)

        //Check rows
        for(let row of board) {
            if (allEqual(row)) return true
        }
        
        //Check columns
        for(let idx = 0; idx < board.length; idx++) {
            const col = board.map(row => row[idx])
            if (allEqual(col)) return true
        }

        //Check Diagonals
        const mainDiag = board.map((row, idx) => row[idx])
        const antiDiag = board.map((row, idx) => row[board.length - 1 - idx])
        if (allEqual(mainDiag) || allEqual(antiDiag)) return true

        //No win on board
        return false
    }

    const checkForTie = () => {
        const boardFull = board.every(row => row.every(val => val !== null) === true)
        return (!checkForWin && boardFull)
    }

    return {
        getBoard,
        resetBoard,
        moveToBoard,
        checkForWin,
        checkForTie,
    }

})()

const Player = (function(initName, initMarker) {
    let name = initName
    const marker = initMarker
    let score = 0

    const setName = (newName) => {
        name = newName
    }

    const getName = () => {
        return name
    }

    const getMarker = () => {
        return marker
    }

    const resetScore = () => {
        score = 0
    }

    const getScore = () => {
        return score
    }

    const addScore = () => {
        score += 1
    }

    return {
        setName,
        getName,
        getMarker,
        resetScore,
        getScore,
        addScore,
    }
})

const Game = (function() {
    const p1 = Player("Player 1", "X")
    const p2 = Player("Player 2", "O")

    let currentPlayer = p1
    let nextStartingPlayer = p2
    let gameOver = false

    const switchPlayer = () => {
        currentPlayer = (currentPlayer === p1) ? p2 : p1
        displayController.renderGameMessage(`${currentPlayer.getName()}'s turn!`)
    }

    const nextRound = () => {
        Gameboard.resetBoard()
        currentPlayer = nextStartingPlayer
        nextStartingPlayer = (nextStartingPlayer === p1) ? p2 : p1
        gameOver = false
        displayController.renderGameboard()
        displayController.renderGameMessage("Game restarted!")
    }

    const resetGame = () => {
        currentPlayer = p1
        nextStartingPlayer = p2
        gameOver = false
        Gameboard.resetBoard()
        displayController.renderGameboard()
        displayController.renderGameMessage("Game reset!")
        p1.resetScore()
        displayController.renderPlayerScore(p1.getScore(), "player1")
        p2.resetScore()
        displayController.renderPlayerScore(p2.getScore(), "player2")
    }

    const playTurn = (x, y) => {
        if (gameOver) {
            displayController.renderGameMessage("Game is over! Restart to play again")
            return
        }
        if(Gameboard.moveToBoard(x, y, currentPlayer.getMarker())) {
            if (Gameboard.checkForWin()) {
                displayController.renderGameMessage(`${currentPlayer.getName()} wins!`)
                currentPlayer.addScore()
                displayController.renderPlayerScore(currentPlayer.getScore(), (currentPlayer === p1) ? "player1" : "player2")
                gameOver = true
                return
            }
            if (Gameboard.checkForTie()) {
                displayController.renderGameMessage("It's a tie!")
                gameOver = true
                return
            }
            switchPlayer()
        } else {
            displayController.renderGameMessage("Invalid move, try again.")
        }
    }

    return {
        playTurn,
        nextRound,
        resetGame,
    }

})()

const displayController = (function() {

    const renderGameboard = () => {
        const displayBoard = document.querySelector(".gameboard")
        displayBoard.innerHTML = ""
        Gameboard.getBoard().forEach((row, x) => {
            row.forEach((tile, y) => {
                const gameTile  = document.createElement("div")
                gameTile.classList.add("game-tile")
                gameTile.innerHTML = tile

                gameTile.addEventListener("click", () =>{
                    Game.playTurn(x, y)
                    renderGameboard()
                } )

                displayBoard.appendChild(gameTile)
            })
        })
    }

    const renderGameMessage = (function(message) {
        const displayMessage = document.querySelector(".game-message")
        displayMessage.innerHTML = message
    })

    const renderPlayerScore = (function(score, playerClass) {
        const displayScore = document.querySelector(`.player-score.${playerClass}`)
        displayScore.innerHTML = score
    })

    return {
        renderGameboard,
        renderGameMessage,
        renderPlayerScore,
    }

})()

displayController.renderGameboard()