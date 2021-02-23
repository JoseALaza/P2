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
  
  // Local array that is updated via server to define who is player and spectator. Should be a max size of 2
  const [playerDef, updateDef] = useState([]);
  
  
  const usernameInput = useRef(null); // Serves to extract username textbox

  // Listening for the server usernameAdd response from the server to update other users.
  // (Needs to be checked for errors as it could update twice for self user)
  useEffect(() => {
    socket.on('usernameAdd', (data) => { // Listening for usernameAdd from server
      console.log('Player logon details received!');
      addUser(prev => [...prev, data]); // Updates userList array
    });
    
    // Cleanup function. Not sure what could be done
    return function cleanup() {
      console.log('A')
    };


  }, []);
  
  // Listening for the server usernameRemove response from the server to update other users.
  // (Needs to be checked for errors as it could update twice for self user)
  useEffect(() => {
    socket.on('usernameRemove', (data) => { // Listening for usernameAdd from server
      console.log('Player logout details received!', userList);
      addUser(prev => itemRemove(prev, data)); // Updates userList array with removal function
    });
    
    // Cleanup function. Not sure what could be done
    return function cleanup() {
      console.log('B')
    };


  }, []);
  
  // Listening for the server playerDefine response from server updating allowed players and spectators.
  // (Needs to be checked for errors as it could update twice for self user)
  useEffect(() => {
    socket.on('playerDefine', (data) => { // Listening for playerDefine from server
      console.log('Players allowed received!');
      updateDef(data); // Overwrite old array to update define
    });
    
    // Cleanup function. Not sure what could be done
    return function cleanup() {
      console.log('C')
    };


  }, []);

  // Array removal similiar to .pop()
  function itemRemove(arr, item) {
    console.log('Before Loop', arr);
    for (var i = 0; i < arr.length; i++) {

      if (arr[i] === item) {

        arr.splice(i, 1);
      }

    }
    console.log('After loop ', arr);
    return arr;
  }

  // Button function for Login sending username to the current state.
  // Sets loginState to render Logout Page
  function onClickLogin() {
    if (usernameInput != null) {
      username = usernameInput.current.value;
      
      socket.emit('userLogin', username) // Sends raw username string to server for proccessing
      
      // Updates the local array of user list
      addUser(prev=>[...prev,username]);
      
      // States used to determine user's log information
      setLogin(1);
      setUser(username);
    }
  }

  // Button functino for Logout removing username from state.
  // Resets loginState to render to Login Page
  function onClickLogout() {
    socket.emit('userLogout', user); // Sends username of current user to serer for proccessing
    
    // Removes the username from the list
    addUser(prev=>itemRemove(prev, user));
    
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
