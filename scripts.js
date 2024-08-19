function createBoard() {
    const gameBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];

    function logBoard() {
        for (let i = 0; i<3; i++) {
            let line = "";
            for (let m = 0; m<3; m++) {
                if (gameBoard[i][m] === null) {
                    line += "- ";
                } else {
                    line += `${gameBoard[i][m]} `;
                }
            }
            console.log(line);
        }
    }

    function checkWinner () {
        // for (let i = 0; i <3; i++) {
        //     if ((gameBoard[i][0] === gameBoard[i][1] && gameBoard[i][0] === gameBoard[i][2] && gameBoard[i][0] != undefined) ||
        //     (gameBoard[0][i] === gameBoard[1][i] && gameBoard[2][i] === gameBoard[0][i]  && gameBoard[0][i] != undefined)) {
        //         logBoard();
        //         return 'won';
        //     }
        // }
        // if ((gameBoard[1][1] === gameBoard[2][2] && gameBoard[2][2] === gameBoard[0][0] && gameBoard[1][1] !=undefined ) || 
        // (gameBoard[1][1] === gameBoard[2][0] && gameBoard[0][2] === gameBoard[2][0]  && gameBoard[1][1] !=undefined)) {
        //     logBoard();
        //     return 'won';
        // }

        // if (gameBoard.every(innerArr => innerArr.every(mark => mark != undefined))) {
        //     logBoard();
        //     return "tie";
        // }
        // logBoard();
        // return false;

        // This is ClaudeAI method
            const winPatterns = [
                0b111000000, 0b000111000, 0b000000111, // Rows
                0b100100100, 0b010010010, 0b001001001, // Columns
                0b100010001, 0b001010100               // Diagonals
            ];
        
            let xState = 0;
            let oState = 0;
            let filledCells = 0;
        
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard[i][j] === 'X') {
                        xState |= (1 << (i * 3 + j));
                        filledCells++;
                    } else if (gameBoard[i][j] === 'O') {
                        oState |= (1 << (i * 3 + j));
                        filledCells++;
                    }
                }
            }
        
            for (let pattern of winPatterns) {
                if ((xState & pattern) === pattern) return 'won';
                if ((oState & pattern) === pattern) return 'won';
            }
        
            if (filledCells === 9) {
                logBoard();
                return 'tie';}
            
                logBoard();
            return false;
    }


    function mark(x , y, mark) {
        gameBoard[x][y] = mark;
    }
    return {gameBoard, checkWinner, mark}
}



function createGame() {
    let mainBoard = createBoard();
    let turn = 'X';

    function changeTurn () {
        turn = turn === "O" ? "X" : "O"; 
    }

    function mark(x, y) {
        mainBoard.mark(x, y, turn);
        if (!mainBoard.checkWinner()) {
            changeTurn();
            return "change";
        } else {
            return endMatch(mainBoard.checkWinner(), turn);
        }
    }

    function endMatch (result, winner) {
        if (result === "tie") {
            return "Tie!";
        } else {
            return `Player ${winner} won`;
        }
    }

    function getTurn () {
        return turn;
    }

    function reset() {
        turn = "X";
        mainBoard = createBoard();
    }

    return {mark, reset, getTurn};
}

function domManipulor () {
    const main = document.querySelector("main");
    const turnTitle = main.firstElementChild;
    const board = turnTitle.nextElementSibling;
    const result = board.nextElementSibling;
    const resetBtn = main.lastElementChild;

    function addListener() {
        board.childNodes.forEach(cell => {
            cell.addEventListener("click", mark);
        });
    }

    const game = createGame();
    function mark(e) {
        const cell = e.target;
        if (cell.textContent) {
            return;
        } else {
            const children = board.children;
            let index = Array.prototype.indexOf.call(children, cell);
            cell.textContent = game.getTurn();
            cell.classList.add("marked");
            switch (game.mark(Math.floor(index / 3), index % 3)) {
                case "change" :
                    changeTurn(game.getTurn());
                    break;
                case "Tie!" :
                    gameTie();
                    break;
                default : gameWon(game.getTurn());
            }
        }
        
    }

    function changeTurn(player) {
        turnTitle.textContent = "It's " + player + "'s turn";
    }

    function gameTie() {
        result.textContent = "Tie!";
    }
    function gameWon(winner) {
        result.textContent = winner + " won!";
        board.childNodes.forEach(cell => {
            cell.removeEventListener("click", mark);
        });
    }
    
    resetBtn.addEventListener("click", reset);


    function reset() {
        board.innerHTML = ``;
        for (let i = 0; i<9; i++) {
            board.appendChild(document.createElement("div"));
        }
        game.reset();
        addListener();
        changeTurn(game.getTurn());
        result.textContent = "";
    }

    reset();
}

{
    const game = domManipulor();
}



