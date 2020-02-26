# flask modules
from flask import Flask, render_template, request, make_response, jsonify, send_from_directory
from flask_cors import CORS, cross_origin

from flask_socketio import emit
from flask_socketio import SocketIO
from flask_socketio import disconnect

import json

PRODUCTION = True

if PRODUCTION:
	BASE_CHATBOT_URL = "https://chatbot.majordome.io"
else:
	BASE_CHATBOT_URL = "http://localhost:5050"

all_clients = []

# Flask app initialization
app = Flask(__name__)

# To have the 'Access-Control-Allow-Origin' header when requesting (important !)
cors = CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*', engineio_logger=False, manage_session=False)

@app.route('/', methods=['GET'])
def index():
	return render_template('index.html')


# run the app
if __name__ == '__main__':
	socketio.run(app, host='0.0.0.0', port=5002, debug=True)