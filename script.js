'use strict'

let secretNumber = Math.trunc(Math.random() * 2) + 1 
let score = 20;
let highScore = 0

const displayMessage = (message) => {
  document.querySelector('.message').textContent = message
}

document.querySelector('.check').addEventListener
('click',() => {
  let guess = Number(document.querySelector('.guess').value)
  //When ther is no input
  if(!guess) {
    //  document.querySelector('.message').textContent = '🚨 No Number !'
    displayMessage('🚨 No Number !')
  //When player wins
  } else if(guess === secretNumber) {
    displayMessage('Correct Number !')
    document.querySelector('.number').textContent = secretNumber;

    document.querySelector('body').style.backgroundColor = '#60b347'
    document.querySelector('.number').style.width = '30rem'

    if( score > highScore ) {
      highScore = score
      document.querySelector('.highscore').textContent = highScore
    }
    // When guess is wrong
  } else if(guess !== secretNumber) {
    if(score > 1) {
      displayMessage(`${guess > secretNumber ? 'Too high!📈' : 'Too low! 📉'}`)
      
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      displayMessage('You lost the game')
      document.querySelector('.score').textContent = 0;
    }
  }  
})


/*
  Implement a gam rest functionality, so that the player
  can make a new guess! Here is how

  1. Select the element with the 'again' class add
  attach a click event handler [x]
  
  2. In the handler function, restore initial values of
  the score and number variables [x]

  3. Restore the initial consitions of the message, number,
  score and guess input field

  4. Also restore the original background color (#222)
  and number width (15rem)
*/

document.querySelector('.again').addEventListener
('click',() => {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 2) + 1 
  displayMessage('Start guessing...')
  document.querySelector('body').style.backgroundColor = '#222'
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').style.width = '15rem'
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = ""
  
})