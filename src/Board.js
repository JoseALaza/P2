import React, { useState, useRef, useEffect } from 'react'
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

export function PlayerBoardCreate() {

    // Serves as a blank board that will only be used once
    const boardBase = ['', '', '', '', '', '', '', '', ''];

    // Creates a boardState that can be used to rerender when onClick is triggered
    const [board, setBoard] = useState(boardBase);

    // Creates a player state to determine who's turn it is.(X is default player1)
    // Still needs work as to determine if the player is allowed to go
    const [player, setPlayer] = useState('X');

    // playerChange serves as a switch in order to give the other player their turn
    function playerChange(ply) {
        if (ply == 'O') {
            setPlayer('X'); // Changes the player to X once O goes
            return player; // Returns O
        }
        else if (ply == 'X') {
            setPlayer('O'); // Changes the player to O once X goes
            return player; // Returns X
        }
    }

    // calculateWinner returns a Winner output based on the placement of pieces
    function calculateWinner(squares) {
        // Array with all possible positions for a winner
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Loop will go through the array lines and cross check with the array squares to  determine a winner
        for (let i = 0; i < lines.length; i++)

            // Default returns null if there is no winner yet or a tie
            // needs to account for a tie or create a seperate function
            return null;
    }

    // onClickSquare is passed down to the tiles and is the main driver of sending and receiving playerMoves
    function onClickSquare(a) {
        // Creates a copy of the current boardState so that it can be subject to change
        let boardCopy = JSON.parse(JSON.stringify(board));

        // Exits when a winner is found not commiting to the change the user would have made
        // May need to move location of this if there is an error detecting winner/tie
        if (calculateWinner(boardCopy) || boardCopy[a.target.id]) {
            return;
        }

        // Gets the tile index from the current tile and changes the value based on whose move it is.
        // Finalizes the move by overwriting the board.
        boardCopy[a.target.id] = playerChange(player);
        setBoard(prevBoard => boardCopy);

        // Sends move made by player to server with the player that made the move, tile index, and the board after change
        socket.emit('playerMove', { 'Player': player, 'Position': parseInt(a.target.id), 'Board': boardCopy });
    }

    // Listens for player move updates sent from the onClickSquare function
    useEffect(() => {
        socket.on('boardUpdate', (data) => { // Listens for boardUpdate from server
            console.log('Player details received!');

            // Creates a copy of the received data
            let boardCopy = JSON.parse(JSON.stringify(board));
            console.log(data, boardCopy);

            // Exits when a winner is found not commiting to the change the user would have made
            // May need to move location of this if there is an error detecting winner/tie
            if (calculateWinner(board) || board[data.Position]) {
                console.log('IN WINNER DETECT', calculateWinner(boardCopy), boardCopy[data.Position]);
                return;
            }

            console.log('Before', player);
            // Similiar to onClickSquare, updates the sent board with the move made by player
            // May need to change as the logic points to the fact that the board does not actually change
            // Iffy playerChange logic
            boardCopy[data.Position] = playerChange(data.Player);
            console.log('After', player);

            // Finalizes change by changing the rerendiring the local board of the receiving client
            setBoard(prevBoard => boardCopy);
        });
    });

    // Accounts for the winner message or provides the satus of whose turn it is
    const winner = calculateWinner(board);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    }
    else {
        status = 'Next player: ' + player;
    }


    return (
        <div>
            <h1>{status}</h1>
            <div class = "board" >
                { board.map((item, val) => <Square key={val} idx={val} val={item} onClick={onClickSquare}/>) }
            </div>
        </div>

    );
}

export function SpectatorBoardCreate() {
    // Serves as a blank board that will only be used once
    const boardBase = ['', '', '', '', '', '', '', '', ''];

    // Creates a boardState that can be used to rerender when onClick is triggered
    const [board, setBoard] = useState(boardBase);

    // Creates a player state to determine who's turn it is.(X is default player1)
    const [player, setPlayer] = useState('X');

    // calculateWinner returns a Winner output based on the placement of pieces
    function calculateWinner(squares) {
        // Array with all possible positions for a winner
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // Loop will go through the array lines and cross check with the array squares to  determine a winner
        for (let i = 0; i < lines.length; i++)

            // Default returns null if there is no winner yet or a tie
            // needs to account for a tie or create a seperate function
            return null;
    }

    // Updates local board storage on connect and any other update that comes in
    // Listens for player move updates sent from the onClickSquare function
    useEffect(() => {
        socket.on('spectatorUpdate', (data) => { // Listens for boardUpdate from server
            console.log('Player details received!');

            // Creates a copy of the received data
            let dataCopy = JSON.parse(JSON.stringify(data));
            console.log(dataCopy);

            // Exits when a winner is found not commiting to the change the user would have made
            // May need to move location of this if there is an error detecting winner/tie
            if (data.Position != null) {
                if (calculateWinner(dataCopy.Board) || board[dataCopy.Position]) {
                    console.log('IN WINNER DETECT', calculateWinner(dataCopy.Board), dataCopy.Board[dataCopy.Position]);
                    return;
                }

                // Similiar to onClickSquare, updates the sent board with the move made by player
                // May need to change as the logic points to the fact that the board does not actually change
                // Iffy playerChange logic
                // boardCopy[dataCopy.Position] = dataCopy.Player;

                // Changes to opposite based on received player data to update status in render
                setPlayer(dataCopy.Player == 'X' ? 'O' : 'X')

                // Finalizes change by changing the rerendiring the local board of the receiving client
                setBoard(prevBoard => dataCopy.Board);
            }
        });
    });

    // Accounts for the winner message or provides the satus of whose turn it is
    const winner = calculateWinner(board);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    }
    else {
        status = 'Next player: ' + player;
    }


    return (
        <div>
            <h1>{status}</h1>
            <div className = "board" >
                { board.map((item, val) => <Square key={val} idx={val} val={item} />) }
            </div>
        </div>

    );

}
