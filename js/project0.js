$('.player-turn').addClass('hidden'); // initially set the turn text hidden
let player = " ";
let gameBoard = {
  row1: [],
  row2: [],
  row3: [],
}
let gameStarted = false;

//function to begin the game, show who's turn it is intially
const startGame = function(){
  $('.player-turn').removeClass('hidden');
  gameStarted = true;
  player = "O";
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
  box.text(player);
  updateGameBoard(box); //updates the gameboard before player variable is swapped
//alternate the players when a box is clicked
  checkWin();
gameStarted === true

  if(gameStarted === true && $('td:empty').length === 0){
    $('.player-turn').text(`It's a tie`);

  }else if(gameStarted === true){
    if(player === "O"){
      player = "X";
    } else{
      player = "O";
    }

    $('.player-turn').text(`player ${player}'s turn`);

  }else if(gameStarted === false){
    $('.player-turn').text(`Player ${player} won!`)
  }


}

//this function updates the gameboard object everytime the board is clicked and filled with a O/X
const updateGameBoard = function($box){
  let key = $box.parent().attr('id');
  let index = $box.attr('class').slice(-1); //slice(-1) slices the string from length+index to length, the last char
  gameBoard[key][index] = player;

}

const checkWin = function() {

  let win = false;


// a player wins when the whole row is theirs

  for(let i = 1; i <= 3; i++ ){
    let currentRow = gameBoard['row' + i];
    // console.log(currentRow);

    let col1 = currentRow[0];
    let col2 = currentRow[1];
    let col3 = currentRow[2];

    if( (col1 === col2  && col1 === col3) && (col1 !== undefined && col2 !== undefined && col3 != undefined)) {
      gameStarted = false;
      // console.log(`Player ${player} won!`);

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
        // console.log(`Player ${player} won!`);
      }

  }

  // a player wins if they have the diagonals (left to right)
  let leftDiagonal = [];

  for(let i = 0; i < 3; i++){
    let currentRow = gameBoard['row' + (i+1)][i];
    leftDiagonal.push(currentRow);
  }

  if( (leftDiagonal[0] === leftDiagonal[1] && leftDiagonal[0] === leftDiagonal[2]) && (leftDiagonal[0] !== undefined && leftDiagonal[1] !== undefined && leftDiagonal[2] !== undefined)){
    gameStarted = false;

  }

  // a player wins if they have the daigonals (right to left)

let rightDiagonal = [gameBoard.row3[0], gameBoard.row2[1], gameBoard.row1[2]];

if( (rightDiagonal[0] === rightDiagonal[1] && rightDiagonal[0] === rightDiagonal[2]) && (rightDiagonal[0] !== undefined && rightDiagonal[1] !== undefined && rightDiagonal[2] !== undefined)){
  gameStarted = false;

}

// // it is a tie when the gameStarted is still true, and there are no empty <td> (all is filled)
// if(gameStarted === true && $('td:empty').length === 0){ //since there are no <td>s that are empty, length should be 0
//
// }


}
