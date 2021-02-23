import React, { useState, useRef, useEffect } from 'react'
import { Square } from './Square.js';
import io from 'socket.io-client';

const socket = io();

export function playerBoardCreate() {
    
    return (
        <div>
        </div>
    );
}