"use strict";

const $playedWords = $("#words");
const $form = $("#newWordForm");
const $wordInput = $("#wordInput");
const $message = $(".msg");
const $table = $("table");

let gameId;


/** Start */

async function start() {
  let response = await axios.post("/api/new-game");
  gameId = response.data.game_id;
  let board = response.data.board;

  displayBoard(board);
}

/** Display board */

function displayBoard(board) {
  $table.empty();
  let $tableBody = $('<tbody>');
  for (let y = 0; y < board.length; y++) {
    let $tableRow = $('<tr>');
    for (let x = 0; x < board[0].length; x++) {
      $tableRow.append(`<td>${board[y][x]}</td>`);
    }
    $tableBody.append($tableRow);
  }
  $table.append($tableBody)
}

/** Get word from input box */

function getWordInput() {
  return $wordInput.val();
}

/** Handle word submit */

async function submitForm(evt) {
  evt.preventDefault();
  const word = getWordInput();
  let response = await axios.post(
    '/api/score-word',
    {game_id: gameId, word: word.toUpperCase()});
  const result = response.data.result;
  if (result === 'ok') {
    $playedWords.append(`<li>${word}</li>`);
    $message.html('');
  } else {
    $message.html(`${result}`);
  }
}

start();
$form.on('submit', submitForm);