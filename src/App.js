import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io();
let  username;

function App() {
  
  const [user, setUser] = useState('')
  
  const usernameInput = useRef(null);
  
  function onClickLogin() {
    username = usernameInput.current.value;
    
    setUser(username);
  }
  
  
  
  return (
    <div>
      <h1>Login page - {user}</h1>
      <input type="text" required/>
      <button onClick={onClickLogin}>Send</button>
    </div>
  );
  
  
  
  
  
  
}

export default App;
