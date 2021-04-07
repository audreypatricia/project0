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
let boardSize = 0;
let inARowNeeded = 0;

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
  } else if($('#option-player2').is(':checked') === true){
    playerTurn =$('#option-player2').val();
  } else { //if nothing is selected, a random player is selected to start first
    playerTurn = Math.floor(Math.random()*2);
  }

  $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
  gameStarted = true;

  //obtains board choice to get board size
  if($('#3x3').is(':checked') === true){
    boardSize = 3;
    inARowNeeded = 3;
  }else if($('#4x4').is(':checked') === true){
    boardSize = 4;
    inARowNeeded = 3;
  }else if($('#5x5').is(':checked') === true){
    boardSize = 5;
    inARowNeeded = 4;
  }else if($('#7x7').is(':checked') === true){
    boardSize = 7;
    inARowNeeded = 5;
  }

  createBoard(boardSize);

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

  // console.log("before " + playerTurn);
  box.text(players['player' + (+ playerTurn + 1)][0]);
  // console.log("middle " + playerTurn);

  // box.fadeOut().fadeIn(function() {
  //   $(this).text(players['player' + (+ playerTurn + 1)][0])
  //   console.log("middle " + playerTurn);
  //   });
    // console.log("after " + playerTurn);
  updateGameBoard(box); //updates the gameboard before player variable is swapped
//alternate the players when a box is clicked
  checkWin(playerTurn);


// it is a tie when the gameStarted is still true, and there are no empty <td> (all is filled)
  if(gameStarted === true && $('td:empty').length === 0){
    $('.player-turn').text(`Game over, it's a tie`);
    gameOver();

//this condition checks in general if gameStart is still true, the game is still running
  }else if(gameStarted === true){
    if(playerTurn == 0){
      playerTurn = 1;
    } else{
      playerTurn = 0;
    }

    //turn off this box's click method once it has been clicked once
    box.off('click');
    // console.log("here");
    $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
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

const checkWin = function(playerTurn) {
  let win = false;

  console.log("here " + boardSize);
  console.log(playerTurn);

// a player wins when the whole row is theirs
// to check for this
// 1) use the playerTurn variable to find the first index of the current player's token we are checking for in the whole row
// 2) then start from this index and count forwards (to the right) when this box and the box+1, box+2 etc.. is equal to it the counter goes up
//3) but when a box next to this box is a different token or empty counter will be -1 and so it wont reach the needed 'in-a-row counter wins'

  for(let i = 1; i <= boardSize; i++){

    let rowArr = $('#row' + i + ' td'); //gets each row and processes them all one row at a time

    let rowVal = []; // this will contain the current row's contents into an array
    for(let j  = 0 ; j < boardSize ; j++){
      rowVal.push(rowArr[j].textContent); // pushing each row content into the array
    }
    // console.log(rowVal);
    let RindexCurrentPlayer = rowVal.indexOf(players['player' + (+ playerTurn + 1)][0]); // finds the first index of the current player's token (who we are checking for a win) in the rowVal array
    // console.log("1 indexOf: " + RindexCurrentPlayer);

    let counter = 0;
    for(let k = 1; k < boardSize; k++){
      // console.log(rowVal[k-1] != "");
      //uses the first instance of the current Player's token and checks to see if every values after that matches it or
      //if matches counter + 1, if NOT match counter - 1
      //waits for a specific win counter to be reached before a win is declared
       if((rowVal[RindexCurrentPlayer] === rowVal[RindexCurrentPlayer + k]) && (rowVal[RindexCurrentPlayer] != "" && rowVal[RindexCurrentPlayer + k] != "")  ){
         counter += 1;
         // console.log("counter: " + counter);
         // console.log(inARowNeeded);


         if(counter >= inARowNeeded - 1){
          // console.log("inside here")
          win = true;

          for(let l = 0 ; l < rowArr.length; l++){

            if(rowArr[l].textContent === players['player' + (+ playerTurn + 1)][0]){
              $(rowArr[l]).addClass('green');
            }
          }
           break;
         }
       } else{
         counter -= 1;
         // console.log("counter2: " + counter)
       }

    }

    if(win === true){
      gameStarted = false;


    }

  }

  // a player wins if the whole column is theirs

for(let i = 0; i < boardSize; i++){

  let colArr = $('.col' + i); // gets each columns
  let colVal = [];
  for(let j = 0 ; j < boardSize; j++){
    colVal.push(colArr[j].textContent);
  } //pushing each row content into the array colVal

  let CindexCurrentPlayer = colVal.indexOf(players['player' + ( + playerTurn + 1)][0]);

  let colCounter = 0;
  for(let k = 1; k < boardSize; k++){

    if((colVal[CindexCurrentPlayer] === colVal[CindexCurrentPlayer + k]) && (colVal[CindexCurrentPlayer] != "" && colVal[CindexCurrentPlayer + k] != "") ){
      colCounter += 1

      if(colCounter >= inARowNeeded - 1){
        win = true;

        for(let l = 0; l < colArr.length; l++){

          if(colArr[l].textContent === players['player' + (+ playerTurn + 1)][0]){
            $(colArr[l]).addClass('green');
          }
        }
        break;
      }
    } else{
      colCounter -= 1;
    }
  }


}

if(win === true){
  gameStarted = false;

//OLD COLUMN CODE
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
  // OLD COLUMN CODE

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
//put player tokens into the players array
const customiseToken = function(){
  let player1 = $('#player1').val(); // get token value from input
  let player2 = $('#player2').val();
  players.player1[0] = player1; // add token to player object
  players.player2[0] = player2;

  let counter1 = $('.0-win'); //change score count text
  let counter2 = $('.1-win');
  counter1.text(`Player ${players.player1[0]} wins: ${players.player1[1]}`);
  counter2.text(`Player ${players.player2[0]} wins: ${players.player2[1]}`);

}

//function to create board depending on the board size chosen by the player
const createBoard = function(boardSize){
  if(boardSize > 3){

    for(let i = 3; i < boardSize ; i++ ){
      //adds the extra <tr> to table //adding extra rows
      $("table").append("<tr></tr>");
      $($('table tr')[i]).attr('id', 'row' + (i + 1)).attr('class', 'row'); // assigns the id name  and class name

      gameBoard['row' + (i+1)] = [];
    }

    //adding extra columns to each row, depending on how many columns they already have at the moment
    for(let i = 1; i <= boardSize; i++){
      let currentRowColNum = $('#row' + i + ' td').length;

        for(let j = currentRowColNum; j < boardSize; j++) {
          $('#row' + i).append('<td></td>');
          $('#row' + i + ' td:last-child').addClass('col' + j);
        }


      }


    }

  }
