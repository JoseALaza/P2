import './App.css';
import './Board.css';
import { PlayerBoardCreate } from './Board.js';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  
  return (
    <div id='info'>
        <PlayerBoardCreate />
    </div>
  );
}

export default App;
