//A few things to hide when the game has not begun
$('.player-turn').addClass('hidden'); // initially set the turn text hidden
$('.play-again').addClass('hidden'); //intially sets play again button hidden
// let players = []; // TODO: change to an object to hold token and wins

//object player stores all player details i.e. token and win-count
//the first array value is for the player token, the second counts wins
let players = {
  player1: [" ", 0],
  player2: [" ", 0],
  player3: ["👾", 0], //this is the computerplayer
}


let isSaved = false;

const saveGame = function(){
  isSaved = true;
  localStorage.setItem("player1Wins", players.player1[1]);
  localStorage.setItem("player2Wins", players.player2[1]);
  localStorage.setItem("computerWins", players.player3[1]);

  localStorage.setItem("player1Token", players.player1[0]);
  localStorage.setItem("player2Token", players.player2[0]);
  localStorage.setItem("isSaved", isSaved);
}

$('.save-game').on('click', saveGame);

if(localStorage.getItem('isSaved') === "true"){

  $('.0-win').text(`Player 1 wins: ${localStorage.getItem("player1Wins")}`);
  $('.1-win').text(`Player 2 wins: ${localStorage.getItem("player2Wins")}`);
  $('.2-win').text(`Computer 👾 wins: ${localStorage.getItem("computerWins")}`);
  players.player1[1] = parseInt(localStorage.getItem("player1Wins"));
  players.player2[1] = parseInt(localStorage.getItem("player2Wins"));
  players.player3[1] = parseInt(localStorage.getItem("computerWins"));

  $('#player1').val(localStorage.getItem("player1Token"));
  $('#player2').val(localStorage.getItem("player2Token"));

  $('.start-game').addClass('hidden');
  $('.play-again').removeClass('hidden');
}

let playerTurn =  0; // this keeps track of which player's turn it is, this is used to call specific player objects
let player1Wins = 0;
let player2Wins = 0;
let boardSize = 0;
let inARowNeeded = 0; //how many in-a-row needed to win the game
let playerMoves = []; // this is used by the computer player to track the moves of the player

// the gameboard object stores the game information during each game, e.g. position of each player's tokens
let gameBoard = {
  row1: [],
  row2: [],
  row3: [],
}
let gameStarted = false; //turned on only when game is started/ played again
let computerPlaying = false; //checks whether the player chooses to play with the computer

//this bit of code hides the inputs for player 2 if the user decides to play against the computer
$('#comp-player').on('change', function(){
  $('.p2').toggle('hidden'); // if computer player checkbox is ticked player 2 toke choice is hidden
  $('.1-win').toggle('hidden');
  if($('#comp-player').is(':checked')){ //when the computer player checkbox is checked then set computerplaying to true else it is false
    computerPlaying = true;
  } else{
    computerPlaying = false;
  }
});

//function to begin the game, show who's turn it is intially
const startGame = function(){
  //depending on who plays hides the score count for the person that does not play e.g.player2 / computer
  if(computerPlaying === true){
    $('.1-win').addClass('hidden');

    //numbering all boxes -- this is used when playing with the computer
    let numOfBoxes = $('td').length;
      for(let i = 1; i <= numOfBoxes; i++){
        $($('td')[i - 1]).attr('id',`${i}`);
      }
    }else{
      $('.2-win').addClass('hidden');
    }


  $('.start-game').addClass('hidden');
  $('.player-turn').removeClass('hidden');

    customiseToken(); //gets the customised token the player chooses

  // this checks which player will go first
  if($('#option-player1').is(':checked') === true){
    playerTurn =$('#option-player1').val(); // get the value "0" back to signal players[0] goes first
  } else if($('#option-player2').is(':checked') === true){
    playerTurn =$('#option-player2').val();
  } else if($('#computer-player').is(':checked') === true){
    playerTurn =$('#computer-player').val();
  } else { //if nothing is selected, a random player is selected to start first
    let num = Math.floor(Math.random()*2);

    if(computerPlaying === true && num === 1){ // if the computer is playing it needs to skip the playerTurn: 1 = which is player2
      playerTurn = num + 1;
    }else{
      playerTurn = num;
    }

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
  }else{ //the default board size if an option is not selected is the classic 3x3
    boardSize = 3;
    inARowNeeded = 3;
  }

  //This magically creates the board *POOF*
  createBoard(boardSize);

  let boxes = $('td');

//set up a listener on each box to fill in the box with the current player O/X when clicked
  for(let i = 0; i < boxes.length; i++){
    let $box = $(boxes[i]);
    $box.on('click', function(e){
      fillBox($box);
    });
  }

  //If computer starts first this will get the computer to make a move
  if(playerTurn == 2){
    console.log("here")
    computerTurn();
  }

}

//attach startGame function to the "start game" button
$('button.start-game').on('click', startGame);

//This is the function that activates when a box is pressed
const fillBox = function(box){

  box.text(players['player' + (+ playerTurn + 1)][0]);
  updateGameBoard(box); //updates the gameboard before player variable is swapped

  let win = checkWin(playerTurn); //check for win after every move

  if(playerTurn === 0){ //this code is used when playing with the computer and pushes player moves into an array
    playerMoves.push(box.attr('id'));

  }

// it is a tie when the gameStarted is still true, and there are no empty <td> (all is filled)
  if(gameStarted === true && $('td:empty').length === 0){
    $('.player-turn').text(`Game over, it's a tie`);
    gameOver(win);

//this condition checks in general if gameStart is still true, the game is still running
  }else if(gameStarted === true ){

    if(computerPlaying === false){ //when computer is not playing
      if(playerTurn == 0){

        playerTurn = 1;
      } else{
        playerTurn = 0;
      }
    }else { //when computer is playing
      console.log("in here: " + playerTurn)
      if(playerTurn == 0){
        playerTurn = 2;
      } else{
        playerTurn = 0;
      }
    }

    $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);

    //if it is time for the computer to play call the computerTurn() function
    if(playerTurn === 2){
      computerTurn();
    }

    //turn off this box's click method once it has been clicked once- avoids accidental clicks and changing the tokens in each box
    box.off('click');


  // if there is a win, the checkWin function would have turned gameStarted into false
  } else if(gameStarted === false) { //checks whether any win conditions were satisfied
    $('.player-turn').text(`Game over, player ${players['player' + (+ playerTurn + 1)][0]} won!`);
    $('win-gif').removeClass('hidden');
    gameOver();
    countWin(playerTurn);
  }

}

const computerTurn = function(){
  //reads the latest move the player has made
  let latestPlayerMove = playerMoves[playerMoves.length - 1];

  //CODE FOR RANDOM COMPUTER MOVES

  let emptyBoxesAmt = $('td:empty').length;
  let randomNum = Math.floor(Math.random()* emptyBoxesAmt);
  let boxToBeFilled = $('td:empty')[randomNum];
  console.log(boxToBeFilled);
  $(boxToBeFilled).text(players['player' + (+ playerTurn + 1)][0]);
  playerTurn = 0;
  console.log("3: " + playerTurn);

  //CODE FOR RANDOM COMPUTER MOVES

  //UNFINISHED CODE TO PLAY WITH UNBEATEABLE COMPUTER

  // switch($('td:empty').length){
  //   case 9:
  //     $('#row3 .col2').text(players['player3'][0]);
  //     break;
  //
  //   case 8:
  //     break;
  //
  //   case 7:
  //     if($('#row2 .col1').text() === players.player1[0]){ // if player goes middle
  //       $('#row1 .col0').text(players['player3'][0]); //computer goes diagonally accross
  //
  //     }else{ //else if player goes to any other position
  //       if($('#7').is(':empty') === true){
  //         $('#7').text(players['player3'][0]); // if this box is empty fill it with comp
  //       } else if($('#3').is(':empty') === true){ //if the left bottom corner is not empty take the top right corner
  //         $('#3').text(players['player3'][0]);
  //       } else{
  //         $('#1').text(players['player3'][0]);
  //       }
  //
  //     }
  //
  //     break;
  //
  //   case 6:
  //     break;
  //
  //   case 5:
  //     if($('#row2 .col1').text() === players.player1[0]){ //if player already has the middle
  //
  //       //and player takes the sides (NOT CORNERS)
  //       if(latestPlayerMove == 2 || latestPlayerMove == 6 || latestPlayerMove == 4 || latestPlayerMove == 8){
  //         if(latestPlayerMove == 2){
  //           $('#8').text(players['player3'][0]);
  //         }else if(latestPlayerMove == 8){
  //           $('#2').text(players['player3'][0]);
  //         }else if(latestPlayerMove == 4){
  //           $('#6').text(players['player3'][0]);
  //         }else if(latestPlayerMove == 6){
  //           $('#4').text(players['player3'][0]);
  //         }
  //       } else if(latestPlayerMove == 3 || latestPlayerMove == 7){ // or player takes the corners
  //
  //         if($('#7').is(':empty') === true){
  //           $('#7').text(players['player3'][0]);
  //         }else{
  //           $('#3').text(players['player3'][0]);
  //         }
  //
  //       }
  //
  //     }else{ //if players take another tile (NOT THE MIDDLE)
  //
  //       if($('#3').is(':empty') == true){
  //         $('#3').text(players['player3'][0]);
  //       }else if($('#1').is(':empty') == true){
  //         $('#1').text(players['player3'][0]);
  //       }else{
  //         $('#7').text(players['player3'][0]);
  //       }
  //
  //
  //     }
  //
  //     break;
  //
  //   case 4:
  //     break;
  //
  //   case 3:
  //     if($('#row2 .col1').text() === players.player1[0]){
  //       if(latestPlayerMove == 7){
  //         $('#3').text(players['player3'][0]);
  //       }else if(latestPlayerMove == 3){
  //         $('#7').text(players['player3'][0]);
  //       }else if($('#1').text() == $('#7').text() && $('#1').text() == $('#9').text()){
  //         if($('#4').is(':empty')){
  //           $('#4').text(players['player3'][0]);
  //         }else{
  //           $('#8').text(players['player3'][0]);
  //         }
  //       }else if($('#1').text() == $('#3').text() && $('#1').text() == $('#9').text()){
  //         if($('#6').is(':empty')){
  //           $('#6').text(players['player3'][0]);
  //         }else{
  //           $('#2').text(players['player3'][0]);
  //         }
  //       }
  //
  //     }else{
  //
  //       if($('#1').text() == $('#7').text() && $('#1').text() == $('#9').text()){
  //         if($('#4').is(':empty') === true){
  //           $('#4').text(players['player3'][0]);
  //         }else{
  //           $('#8').text(players['player3'][0]);
  //         }
  //       }else if($('#3').text() == $('#7').text() && $('#3').text() == $('#9').text()){
  //         if($('#6').is(':empty') === true){
  //           $('#6').text(players['player3'][0]);
  //         }else if($('#8').is(':empty') === true){
  //           $('#8').text(players['player3'][0]);
  //         }else if($('#5').is(':empty') === true){
  //           $('#5').text(players['player3'][0]);
  //         }
  //       }
  //     }
  //     break;
  //
  //   case 2:
  //     break;
  //
  //   case 1:
  //     $($('td:empty')[0]).text(players['player3'][0]); //fill out the remaining empty box
  //     break;
  // }
  //
  // checkWin(playerTurn);
  //
  // if(gameStarted === false){
  //   $('.player-turn').text(`Game over, player ${players['player' + (+ playerTurn + 1)][0]} won!`);
  //   gameOver();
  //   countWin(playerTurn);
  // }
  // else{
  // playerTurn = 0;
  // $('.player-turn').text(`It's player's ${players['player' + (+ playerTurn + 1)][0]} turn`);
  // }
}

//this function updates the gameboard object everytime the board is clicked and filled with a O/X
const updateGameBoard = function($box){
  let key = $box.parent().attr('id');
  let index = $box.attr('class').slice(-1); //slice(-1) slices the string from length+index to length, the last char
  gameBoard[key][index] = players['player' + (+ playerTurn + 1)][0];

}

const checkWin = function(playerTurn) {
  let win = false;
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
    let RindexCurrentPlayer = rowVal.indexOf(players['player' + (+ playerTurn + 1)][0]); // finds the first index of the current player's token (who we are checking for a win) in the rowVal array

    let counter = 0;
    for(let k = 1; k < boardSize; k++){
      //uses the first instance of the current Player's token and checks to see if every values after that matches it or
      //if matches counter + 1, if NOT match counter - 1
      //waits for a specific win counter to be reached before a win is declared
       if((rowVal[RindexCurrentPlayer] === rowVal[RindexCurrentPlayer + k]) && (rowVal[RindexCurrentPlayer] != "" && rowVal[RindexCurrentPlayer + k] != "")  ){
         counter += 1;

         if(counter >= inARowNeeded - 1){
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
       }
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


    // a player wins if they have the diagonals (left to right)
  let index = boardSize - 1; // because the pattern is reversed
  //row1[col2]  row2[col1]  rpw3[col0] so this index will be opposite of the 'i' to assign get the right boxes to give is a right-diag class
  for(let i = 1; i <= boardSize; i++){
    $('#row' + i + " .col" + index).addClass('left-diag');
    index--;
  }

  let leftDiagArr = $('.left-diag');

  let leftDiagVal = [];
  for(let j = 0 ; j < boardSize; j++){
    leftDiagVal.push(leftDiagArr[j].textContent)
  }

  let LDindexCurrentPlayer = leftDiagVal.indexOf(players['player' + ( + playerTurn + 1)][0]);

  let LDcounter = 0;
  for(let k = 1; k < boardSize; k++){

    if((leftDiagVal[LDindexCurrentPlayer] === leftDiagVal[LDindexCurrentPlayer + k]) && (leftDiagVal[LDindexCurrentPlayer] != "" && leftDiagVal[LDindexCurrentPlayer + k] != "")  ){
      LDcounter += 1;

      if(LDcounter >= inARowNeeded - 1){
        win = true;

        for(let l = 0; l < leftDiagArr.length; l++){

          if(leftDiagArr[l].textContent === players['player' + (+ playerTurn + 1)][0]){
            $(leftDiagArr[l]).addClass('green');
          }
        }
        break;
      }
    }else {
      LDcounter -= 1;
    }
  }

  // a player wins if they have the diagonals (right to left)
  //putting the class on all boxes that are on the left diagonal axis
    for(let i = 0; i < boardSize; i++){
      $('#row' + (i+1) + " .col" + i).addClass('right-diag');
    }

    let rightDiagArr = $('.right-diag');

    let rightDiagVal = [];
    for(let j = 0 ; j < boardSize; j++){
      rightDiagVal.push(rightDiagArr[j].textContent)
    }

    let RDindexCurrentPlayer = rightDiagVal.indexOf(players['player' + ( + playerTurn + 1)][0]);

    let RDcounter = 0;
    for(let k = 1; k < boardSize; k++){

      if((rightDiagVal[RDindexCurrentPlayer] === rightDiagVal[RDindexCurrentPlayer + k]) && (rightDiagVal[RDindexCurrentPlayer] != "" && rightDiagVal[RDindexCurrentPlayer + k] != "")  ){
        RDcounter += 1;

        if(RDcounter >= inARowNeeded - 1){
          win = true;

          for(let l = 0; l < rightDiagArr.length; l++){

            if(rightDiagArr[l].textContent === players['player' + (+ playerTurn + 1)][0]){
              $(rightDiagArr[l]).addClass('green');
            }
          }
          break;
        }
      }else {
        RDcounter -= 1;
      }
    }

    if(win === true){
      gameStarted = false;
    }
    return win;
}

//this function is used when the game is over due to a player win or a tie, so that the board is no longer clickable
//and the "play again" button re-appears
const gameOver = function(win){

  $('table td').off('click');
  $('.play-again').removeClass('hidden');
  if(win === true){
    $('.win-gif').removeClass('hidden');
    $('.win-cat').removeClass('hidden');
  }

  playerMoves = [];
}

const playAgain = function(){
  $('table td').empty(); //clears out all data on the board
  $('table td').removeClass('green'); // removes any green class boxes
  $('.win-gif').addClass('hidden');
  $('.win-cat').addClass('hidden');
  startGame();
}

$('.play-again').on('click', playAgain);

// win counter
const countWin = function(playerTurn){

  // if(localStorage.getItem('isSaved') === "true"){
  //   players['player' + ( + playerTurn + 1)][1] = parseInt(localStorage.getItem('player' + (+ playerTurn + 1) + 'Wins'));
  // }

  let counter = $('.' + playerTurn + '-win');

  players['player' + (+ playerTurn + 1)][1] += 1;

  if(computerPlaying === false){
  counter.text(`Player ${players['player' + (+ playerTurn + 1)][0]} wins: ${players['player' + (+ playerTurn + 1)][1]}`);
  }

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
  let counter3 = $('.2-win');
  counter1.text(`Player ${players.player1[0]} wins: ${players.player1[1]}`);
  counter2.text(`Player ${players.player2[0]} wins: ${players.player2[1]}`);
  counter3.text(`Player ${players.player3[0]} wins: ${players.player3[1]}`);

//if the computer is not playing then the player 2 values/ tokens will be initialised
  // if(computerPlaying === false){
  //   let player2 = $('#player2').val();
  //   players.player2[0] = player2;
  //   counter2.text(`Player ${players.player2[0]} wins: ${players.player2[1]}`);
  // } else{ //if computer is playing
  //   counter2.text(`Player ${players.player3[0]} wins: ${players.player3[1]}`);
  // }

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

    let trLength = $('tr').length;
    for(let i = trLength; i > boardSize; i-- ){
        $('tr:last-child').remove();
    }
  }
