
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

CHAPTERS_DIR = os.path.join(os.path.dirname(__file__), '../chapters')
MATRIX_FILE = os.path.join(os.path.dirname(__file__), '../matrix/matrix_template.json')


@app.route('/')
def index():
    return jsonify({"status": "Matrix Dashboard Backend Running"})


@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    files = [f for f in os.listdir(CHAPTERS_DIR) if f.endswith('.md') or f.endswith('.json')]
    return jsonify({"chapters": files})


@app.route('/api/matrix', methods=['GET'])
def get_matrix():
    if not os.path.exists(MATRIX_FILE):
        return jsonify({"error": "Matrix file not found"}), 404
    with open(MATRIX_FILE, 'r') as f:
        data = json.load(f)
    return jsonify(data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
