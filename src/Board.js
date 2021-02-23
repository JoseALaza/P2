import React, { useState, useRef, useEffect } from 'react'
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

// Serves as a blank board that will only be used once
const boardBase = ['', '', '', '', '', '', '', '', ''];

// Creates a boardState that can be used to rerender when onClick is triggered
const [board, setBoard] = useState(boardBase);

// Creates a player state to determine who's turn it is.(X is default player1)
// Still needs work as to determine if the player is allowed to go
const [player, setPlayer] = useState('X')

export function playerBoardCreate() {

    return (
        <div>
            <h1>{status}</h1>
            <div class = "board" >
                { board.map((item, val) => <Square key={val} idx={val} val={item} onClick={onClickSquare}/>) }
            </div>
        </div>

    );
}
