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
import os
import glob
import frontmatter
from flask import Flask, jsonify, abort

app = Flask(__name__)

CHAPTERS_DIR = os.path.join(os.path.dirname(__file__), '..', 'chapters')

@app.route('/api/chapters', methods=['GET'])
def list_chapters():
    chapters = []
    files = glob.glob(os.path.join(CHAPTERS_DIR, '*.md'))
    for filepath in files:
        try:
            post = frontmatter.load(filepath)
            chapters.append({
                'filename': os.path.basename(filepath),
                'title': post.get('title', 'Untitled'),
                'theme': post.get('theme', ''),
                'tone': post.get('tone', ''),
                'anchor': post.get('anchor', '')
            })
        except Exception as e:
            print(f"Error loading {filepath}: {e}")
    return jsonify(chapters)

@app.route('/api/chapters/<filename>', methods=['GET'])
def get_chapter(filename):
    if '..' in filename or '/' in filename:
        abort(400)  # Prevent path traversal
    filepath = os.path.join(CHAPTERS_DIR, filename)
    if not os.path.exists(filepath):
        abort(404)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        return jsonify({'filename': filename, 'content': content})
    except Exception as e:
        abort(500, description=str(e))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0' 
