import os
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

userQueue = []

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@socketio.on('userLogin')
def on_login(userInfo):
    userQueue.append(userInfo)
    
    socketio.emit('usernameAdd',userInfo)
    socketio.emit('playerDefine',userQueue[0:2])
    
    print('User Login!\n', userInfo, '\n',userQueue)

@socketio.on('userLogout')
def on_logout(userInfo):
    userQueue.pop(userQueue.index(userInfo))
    
    socketio.emit('usernameRemove',userInfo)
    socketio.emit('playerDefine',userQueue[0:2])
    
    print('\n\nUser Logout!\n', userInfo, '\n',userQueue)

socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
