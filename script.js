const gameContainer = document.getElementById("game");
let cardsUp = [];
let currentCard = new Object();
let matchedCards = [];
let lockGame = true;
let pairsLength = 0;
let shuffledColors = [];
let newShuffledColors = [];

let cardDeck = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];


const playBtn = document.querySelector('#play');
playBtn.onclick = function(){
  lockGame = false;
}

const currentScore = document.querySelector('#score');
let runningScore = 0;

const currentTries = document.querySelector('#tries');
let runningTries = 0;

const bestTry = document.querySelector('#best');

let localBest = JSON.parse(localStorage.getItem("best"));
if (localBest != null){
  actualBest = localBest;
  bestTry.innerText = `Best Try: ${actualBest}`;
} else {
  actualBest = 0;
}

const resetBtn = document.querySelector('#reset');
resetBtn.onclick = function(){
  closeCards(cardsUp);
  closeCards(matchedCards);
  cardsUp = [];
  currentCard = new Object();
  matchedCards = [];
  runningScore = 0;
  runningTries = 0;
  currentScore.innerText = `Pairs Found: ${runningScore}`;
  currentTries.innerText = `Tries: ${runningTries}`;
  bestTry.innerText = `Best Try: ${actualBest}`;
}

const resetBest = document.querySelector('#resetBest');
resetBest.onclick = function(){
  localStorage.removeItem("best");
  bestTry.innerText = `Best Try: 0`;
}

let numberInput = document.querySelector('#cardCount');
numberInput.addEventListener('keypress', function(e){
  if (e.keyCode === 13) {
    if (numberInput.value % 2 == 0){
      pairsLength = numberInput.value/2;
      generateCardDeck();
    }
  }
});

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

shuffledColors = shuffle(cardDeck);

function generateCardDeck(){
  cardDeck = [];
  for(let i=0; i < pairsLength; i++){
    //cardDeck.concat(getRandomColor());
    cardDeck = cardDeck.concat(getRandomColor());
  }
  const usedCards = document.querySelectorAll('div');
  usedCards.forEach(card => {
    if (card.getAttribute('id') != 'game') {
      card.remove();
    }
  })
  shuffledColors = shuffle(cardDeck);
  createDivsForColors(shuffledColors);
};




// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let i = 0;
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    const att = document.createAttribute("id");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.setAttribute("id", i);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    i++;
  }
}

// TODO: Implement this function!
function handleCardClick(e) {
  //debugger;
  // you can use event.target to see which element was clicked
  if (lockGame) return;
  currentCard = e.target;
  if (matchedCards.some(elem => elem.target.id === currentCard.id)) return;
  if (isOpen(currentCard)) { //Card is already up, close it
    closeCard(currentCard);
    if (cardsUp.length != 0){
      currentCard = cardsUp[0].target;
    };
  } else if ((cardsUp.length >= 1) && isMatch(cardsUp[0].target, currentCard)){
    currentCard.style.backgroundColor = getClass(currentCard);
    matchedCards.push(e);
    matchedCards.push(cardsUp[0]);
    cardsUp = [];
  } else if (cardsUp.length < 2) {  // Less than 2 are opened
    currentCard.style.backgroundColor = getClass(currentCard);
    cardsUp.push(e);
    if (cardsUp.length == 2){
      lockGame = true;
      setTimeout(function() {
        closeCards(cardsUp);
        lockGame = false;
      }, 1000);
    }
  } else {    // More are two are opened, so close it.
    currentCard.style.backgroundColor = getClass(currentCard);
    closeCards(cardsUp);
    cardsUp = [];
    cardsUp.push(e);
  }
  runningScore = matchedCards.length/2;
  runningTries++;
  currentScore.innerText = `Pairs Found: ${runningScore}`;
  currentTries.innerText = `Tries: ${runningTries}`;

  if(shuffledColors.length == matchedCards.length){
    if (actualBest == 0) {
      actualBest = runningTries;
      localStorage.setItem("best", JSON.stringify(actualBest));
    } else if (runningTries <= actualBest) {
      actualBest = runningTries;
      localStorage.setItem("best", JSON.stringify(actualBest));
    }
    bestTry.innerText = `Best Try: ${actualBest}`;
  }
};

function closeCard(current){
  current.style.backgroundColor = null;
  for (let i=0; i < cardsUp.length; i++){
    if (cardsUp[i].id == current.id) {
      cardsUp.splice(i,1);
    }
  }
};

function closeCards(cards){
  for (let card of cards){
    card.target.style.backgroundColor = null;
  }
  cardsUp.splice(0,2);
};

function isOpen(card){
  let cardStatus = false;
  if (cardsUp.length === 0){
    cardStatus = false;
  } else {
    for (let i=0; i < cardsUp.length; i++){
      if (cardsUp[i].target.id == card.id){
        cardStatus = true;
      }
    }
  }
  return cardStatus;
};

function isMatch(oldCard, newCard){
  let cardStatus = false;
  if (getClass(oldCard) == getClass(newCard)){
    cardStatus = true;
  }
  return cardStatus;
}

function getClass(card){
  return card.getAttribute("class");
}

// Color Maker Source: https://stackoverflow.com/questions/1484506/random-color-generator
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return [color, color];
}

// when the DOM loads
createDivsForColors(shuffledColors);