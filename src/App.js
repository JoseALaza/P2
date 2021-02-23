import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  return (
    <div>
      <h1>Login page</h1>
      <input type="text" required/>
      <button>Send</button>
    </div>
  );
}

export default App;
