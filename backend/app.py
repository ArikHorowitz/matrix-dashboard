from flask import Flask, jsonify, abort, request
from flask_cors import CORS
import os
import json
import glob
import frontmatter

app = Flask(__name__)
CORS(app)

# Absolute paths to content folders
CHAPTERS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../chapters'))
MATRIX_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../matrix/matrix_template.json'))

@app.route('/')
def index():
    return jsonify({"status": "Matrix Dashboard Backend Running"})

# List available chapters
@app.route('/api/chapters', methods=['GET'])
def list_chapters():
    try:
        files = [
            f for f in os.listdir(CHAPTERS_DIR)
            if f.endswith('.md') or f.endswith('.json')
        ]
        return jsonify({"chapters": files})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get content of a specific chapter
@app.route('/api/chapters/<filename>', methods=['GET'])
def get_chapter(filename):
    if '..' in filename or '/' in filename:
        abort(400)  # Prevent directory traversal

    filepath = os.path.join(CHAPTERS_DIR, filename)
    if not os.path.exists(filepath):
        abort(404)

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'filename': filename, 'content': content})
    except Exception as e:
        abort(500, description=str(e))

# Get matrix data
@app.route('/api/matrix', methods=['GET'])
def get_matrix():
    if not os.path.exists(MATRIX_FILE):
        return jsonify({"error": "Matrix file not found"}), 404
    try:
        with open(MATRIX_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
