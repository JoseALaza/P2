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

boardUpdate_data = None

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)


@socketio.on('playerMove')
def on_move(data):
    print(data, 'Player details')
    boardUpdate_data = data
    socketio.emit('boardUpdate',  data, broadcast=True, include_self=False)
    socketio.emit('spectatorUpdate',  data, broadcast=True, include_self=False)
    
@socketio.on('connect')
def on_connect():
    socketio.emit('spectatorUpdate',  boardUpdate_data, broadcast=True, include_self=False)


socketio.run(
    app,
    host=os.getenv('IP', '0.0.0.0'),
    port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
)
