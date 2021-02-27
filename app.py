import os
import copy
import json
from flask import Flask, send_from_directory, json, session
from flask_socketio import SocketIO
from flask_cors import CORS

app = Flask(__name__, static_folder='./build/static')

cors = CORS(app, resources={r"/*": {"origins": "*"}})

socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=json,
    manage_session=False
)


global boardUpdate_data
boardUpdate_data = {}
userQueue = []

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('userLogin')
def on_login(userInfo):
    global boardUpdate_data
    
    userQueue.append(userInfo)
    
    socketio.emit('usernameAdd',userInfo)
    socketio.emit('playerDefine',userQueue[0:2])
    socketio.emit('spectatorUpdate',  boardUpdate_data, broadcast=True, include_self=False)
    
    print('User Login!\n', userInfo, '\n',userQueue)

@socketio.on('userLogout')
def on_logout(userInfo):
    global boardUpdate_data
    
    if boardUpdate_data:
        if boardUpdate_data['Board'].count('')!=9 and userInfo in userQueue[0:2]:
            socketio.emit('forfeit', userInfo)
            boardUpdate_data = {}
            print('PLAYER FORFEIT', userInfo)
        
    userQueue.pop(userQueue.index(userInfo))
    
    socketio.emit('usernameRemove',userInfo)
    socketio.emit('playerDefine',userQueue[0:2])
    
    
    
    print('\n\nUser Logout!\n', userInfo, '\n',userQueue)
    
    
@socketio.on('tabClose')
def on_Close(userInfo):
    global boardUpdate_data
    
    print('\n\nUser Refresh/Close!\n', userInfo, '\n',userQueue)
    
    if boardUpdate_data:
        if boardUpdate_data['Board'].count('')!=9 and userInfo in userQueue[0:2]:
            socketio.emit('forfeit', userInfo)
            boardUpdate_data = {}
            print('PLAYER FORFEIT', userInfo)
        
    userQueue.pop(userQueue.index(userInfo))
    
    socketio.emit('usernameRemove',userInfo)
    socketio.emit('playerDefine',userQueue[0:2])
    
    
    
    print('\n\nUser Refresh/Close!\n')#, '\n',userQueue)
    print('|',userInfo,'|')
    
@socketio.on('connect')
def on_connect():
    global boardUpdate_data
    
    socketio.emit('playerDefine',userQueue[0:2])
    socketio.emit('userUpdate', userQueue)
    socketio.emit('spectatorUpdate',  boardUpdate_data, broadcast=True, include_self=False)
    print('\n\nUser Connected\n', userQueue, '\n', boardUpdate_data)
    
@socketio.on('disconnect')
def on_disconnect():
    print('\n\nUser Disconnected\n')

@socketio.on('playerMove')
def on_move(data):
    global boardUpdate_data
    print(data, 'Player move')
    
    boardUpdate_data = copy.deepcopy(data)
    
    socketio.emit('boardUpdate',  data, broadcast=True, include_self=False)
    socketio.emit('spectatorUpdate',  data, broadcast=True, include_self=False)
    
    print('ON MOVE',boardUpdate_data)
    
@socketio.on('restart')
def on_restart(data):
    global boardUpdate_data
    
    boardUpdate_data = {}
    socketio.emit('restart',data)
    
    print('\n\nUser Restart\n', userQueue, '\n', boardUpdate_data)

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
