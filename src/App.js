import './App.css';
import './Board.css';
import { playerBoardCreate } from './Board.js';
import React, { useEffect, useState, useRef } from 'react';

function App() {
  
  return (
    <div id='info'>
        <playerBoardCreate />
    </div>
  );
}

export default App;
