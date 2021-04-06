$('.player-turn').addClass('hidden'); // initially set the turn text hidden
$('.play-again').addClass('hidden'); //intially sets play again button hidden
// let players = []; // TODO: change to an object to hold token and wins

let players = {
  player1: [" ", 0], //the first array value is for the player token, the second counts wins
  player2: [" ", 0],
}

let playerTurn =  0; // this keeps track of which player's turn it is
let player1Wins = 0;
let player2Wins = 0;

let gameBoard = {
  row1: [],
  row2: [],
  row3: [],
}
let gameStarted = false;

//function to begin the game, show who's turn it is intially
const startGame = function(){
  $('.start-game').addClass('hidden');
  $('.player-turn').removeClass('hidden');
  customiseToken(); //gets the customised token the player chooses

  // this checks which player will go first
  if($('#option-player1').is(':checked') === true){
    playerTurn =$('#option-player1').val(); // get the value "0" back to signal players[0] goes first
    console.log('here1 ' + playerTurn);
  } else if($('#option-player2').is(':checked') === true){
    playerTurn =$('#option-player2').val();
  } else { //if nothing is selected, a random player is selected to start first
    playerTurn = Math.floor(Math.random()*2);
  }

  $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
  gameStarted = true;


  let boxes = $('td');

//set up a listener on each box to fill in the box with the current player O/X when clicked
  for(let i = 0; i < boxes.length; i++){
    let $box = $(boxes[i]);
    $box.on('click', function(e){
      fillBox($box);
    });
  }


}

//attach startGame function to the "start game" button
$('button.start-game').on('click', startGame);


const fillBox = function(box){
  box.text(players['player' + (+ playerTurn + 1)][0]);
  updateGameBoard(box); //updates the gameboard before player variable is swapped
//alternate the players when a box is clicked
  checkWin();
gameStarted === true

// it is a tie when the gameStarted is still true, and there are no empty <td> (all is filled)
  if(gameStarted === true && $('td:empty').length === 0){
    $('.player-turn').text(`Game over, it's a tie`);
    gameOver();

//this condition checks in general if gameStart is still true, the game is still running
  }else if(gameStarted === true){
    if(playerTurn == 0){
      playerTurn = 1;
      console.log("here2a");
    } else{
      playerTurn = 0;
      console.log("here2b")
    }

    $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
    console.log("here3 " + players['player' + (+ playerTurn + 1)][0])
  }else if(gameStarted === false){ //checks whether any win conditions were satisfied
    $('.player-turn').text(`Game over, player ${players['player' + (+ playerTurn + 1)][0]} won!`);
    gameOver();
    countWin(playerTurn);
  }


}

//this function updates the gameboard object everytime the board is clicked and filled with a O/X
const updateGameBoard = function($box){
  let key = $box.parent().attr('id');
  let index = $box.attr('class').slice(-1); //slice(-1) slices the string from length+index to length, the last char
  gameBoard[key][index] = players['player' + (+ playerTurn + 1)][0];

}

const checkWin = function() {

  let win = false;


// a player wins when the whole row is theirs

  for(let i = 1; i <= 3; i++){
    let rowArr = $('#row' + i + ' td');

    let col1 = rowArr[0].textContent;
    let col2 = rowArr[1].textContent;
    let col3 = rowArr[2].textContent;

    if( (col1 === col2  && col1 === col3) && (col1 !== "" && col2 !== "" && col3 != "")) {
      gameStarted = false;

      rowArr.addClass('green');

    }

  }

  // a player wins if the whole column is theirs

  for(let i = 0; i < 3; i++){
      let columnArr = $('td.col' + i);
      // console.log(columnArr);
      let row1 = columnArr[0].textContent;
      let row2 = columnArr[1].textContent;
      let row3 = columnArr[2].textContent;

      if( (row1 === row2  && row1 === row3) && (row1 !== "" && row2 !== "" && row3 !== "")){
        gameStarted = false;

        columnArr.addClass('green');
      }

  }

  // a player wins if they have the diagonals (left to right)
  let leftDiagonal = $('.left-diag');
  let lBox1 = leftDiagonal[0].textContent;
  let lBox2 = leftDiagonal[1].textContent;
  let lBox3 = leftDiagonal[2].textContent;

  if( (lBox1 === lBox2 && lBox1 === lBox3) && (lBox1 !== "" && lBox2 !== "" && lBox3 !== "")){
    gameStarted = false;
    leftDiagonal.addClass('green');
  }
  // a player wins if they have the daigonals (right to left)

  let rightDiagonal = $('.right-diag');
  let rBox1 = rightDiagonal[0].textContent;
  let rBox2 = rightDiagonal[1].textContent;
  let rBox3 = rightDiagonal[2].textContent;

  if( (rBox1 === rBox2 && rBox1 === rBox3) && (rBox1 !== "" && rBox2 !== "" && rBox3 !== "")){
    gameStarted = false;
    rightDiagonal.addClass('green');
  }


}

//this function is used when the game is over due to a player win or a tie, so that the board is no longer clickable
//and the "play again" button re-appears
const gameOver = function(){
  $('table td').off('click');
  $('.play-again').removeClass('hidden');
}

const playAgain = function(){
  $('table td').empty(); //clears out all data on the board
  $('table td').removeClass('green'); // removes any green class boxes
  // player = 'O' // TODO: ATM only 'O' starts first, set it up so anyone can start first
  // $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
  startGame();
}

$('.play-again').on('click', playAgain);

// win counter
const countWin = function(playerTurn){
  let counter = $('.' + playerTurn + '-win');
  // console.log(counter);
  // let initial = counter.text().slice(0, counter.text().length - 1) // gets the initial phrase e.g. "X's wins: "
  // console.log(initial);
  // let wins = counter.text().slice(-1); //get the score number which is the last character on the win string
  // wins = + wins + 1;

  let currentWinCount = players['player' + (+ playerTurn + 1)][1]; // gets the current win score of the winner player

  currentWinCount += 1;

  players['player' + (+ playerTurn + 1)][1] += 1;

  counter.text(`Player ${players['player' + (+ playerTurn + 1)][0]} wins: ${players['player' + (+ playerTurn + 1)][1]}`);

}

// allow players to customise their token
//// TODO: put player tokens into the players array
const customiseToken = function(){
  let player1 = $('#player1').val();
  let player2 = $('#player2').val();
  players.player1[0] = player1;
  players.player2[0] = player2;

  let counter1 = $('.0-win');
  let counter2 =$('.1-win');
  counter1.text(`Player ${players.player1[0]} wins: ${players.player1[1]}`);
  counter2.text(`Player ${players.player2[0]} wins: ${players.player2[1]}`);

}
