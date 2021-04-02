$('.player-turn').addClass('hidden'); // initially set the turn text hidden
let player = " ";

//function to begin the game, show who's turn it is intially
const startGame = function(){
  $('.player-turn').removeClass('hidden');
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


const fillBox = function(box){
  box.text(player);

//alternate the players when a box is clicked
  if(player === "O"){
    player = "X";
  } else{
    player = "O";
  }

$('.player-turn').text(`player ${player}'s turn`);

}
