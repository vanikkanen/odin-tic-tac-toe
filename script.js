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

    const setName = (newName) => {
        name = newName
    }

    const getName = () => {
        return name
    }

    const getMarker = () => {
        return marker
    }

    return {
        setName,
        getName,
        getMarker,
    }
})

