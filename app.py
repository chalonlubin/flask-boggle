from flask import Flask, request, render_template, jsonify
from uuid import uuid4

from boggle import BoggleGame

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-secret"

# The boggle games created, keyed by game id
games = {}


@app.get("/")
def homepage():
    """Show board."""

    return render_template("index.html")


@app.post("/api/new-game")
def new_game():
    """Start a new game and return JSON: {game_id, board}."""

    # get a unique string id for the board we're creating
    game_id = str(uuid4())
    game = BoggleGame()
    games[game_id] = game

    return jsonify({"game_id": game_id, "board": game.board})

@app.post('/api/score-word')
def score_word():
    """Check if a word is a legal word on the board and
    return JSON: {result}"""
    game_id = request.json['game_id']
    word = request.json['word']
    game = games[game_id]

    json_resp = {}

    if not game.is_word_in_word_list(word):
        json_resp['result'] = 'not-word'
    elif not game.check_word_on_board(word):
        json_resp['result'] = 'not-on-board'
    else:
        json_resp['result'] = 'ok'

    return jsonify(json_resp)