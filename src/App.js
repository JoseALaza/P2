import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io();
let username;

function App() {

  // Serves to control the username of the current user. (could possibly use this as login state)
  const [user, setUser] = useState('')

  // 0 refers to the current user not logged in, 1 is the user already logged in
  const [loginState, setLogin] = useState(0)
  
  // Local array that is updated via server to maintain a total list of 'connected' users
  const [userList, addUser] = useState([]);
  
  // Local array that is updated via server to define who is player and spectator
  const [playerDef, updateDef] = useState([]);
  
  const usernameInput = useRef(null); // Serves to extract username textbox

  // Button function for Login sending username to the current state.
  // Sets loginState to render Logout Page
  function onClickLogin() {
    if (usernameInput != null) {
      username = usernameInput.current.value;
      
      socket.emit('userLogin', username) // Sends raw username string to server for proccessing
      
      // States used to determine user's log information
      setLogin(1);
      setUser(username);
    }
  }

  // Button functino for Logout removing username from state.
  // Resets loginState to render to Login Page
  function onClickLogout() {
    socket.emit('userLogout', user); // Sends username of current user to serer for proccessing
    
    // States used to determine user's log information
    setLogin(0);
    setUser('');
  }
  
  // Renders a login page to users by default
  if (!loginState) {
    return (
      <div>
        <h1>Login page</h1>
        <label>Username:</label>
        <input type="text" ref={usernameInput} required/>
        <button onClick={onClickLogin}>Send</button>
      </div>
    );
  }
  
  // Renders a logout page once a user has submitted a valid username
  if (loginState) {
    return (
      <div>
        <h1>Logout page - {user}</h1>
        <button onClick={onClickLogout}>Logout</button>
      </div>
    );
  }






}

export default App;
