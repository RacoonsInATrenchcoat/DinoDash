// script.js
const rootElement = document.getElementById('root');

const DinoPositionElement = document.getElementById('DinoPosition');
DinoPositionElement.innerText = 0;
const CactusPositionElement = document.getElementById('CactusPosition');
CactusPositionElement.innerText = 0;

//Topbar
const TopbarElement = document.getElementById('Topbar');
TopbarElement.classList.add("Topbar")

//basic elements
const dino = document.getElementById('dino');
const dinostyles = window.getComputedStyle(dino); //this pulls the data from CSS into JS
const dinoWidth = parseInt(dinostyles.width, 10); //converts


const cactus = document.getElementById('cactus');
const cactusstyles = window.getComputedStyle(cactus);
const cactusWidth = parseInt(cactusstyles.width, 10);

//Score + high score
let currentScoreElement = document.getElementById('CurrentScore');
TopbarElement.classList.add("CurrentScore")
let currentScore = 0;
currentScoreElement.innerText = currentScore
TopbarElement.appendChild(currentScoreElement);


const highScoreArray = [];

//functionality
let isJumping = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && !isJumping) {
        jump();
    }
});

function jump() {
    isJumping = true;
    let position = 50;

    const upInterval = setInterval(() => {
        if (position >= 250) {
            clearInterval(upInterval);

            // Falling down
            const downInterval = setInterval(() => {
                if (position <= 50) {
                    clearInterval(downInterval);
                    position = 50; // Ensure position is exactly 0
                    isJumping = false;
                } else {
                    position -= 5;
                    dino.style.bottom = position + 'px';
                }
            }, 20);
        } else {
            position += 5;
            dino.style.bottom = position + 'px';
        }
    }, 20);
}



// Set initial position
let cactusPositionW = window.innerWidth; // Start at the far right of the screen


function moveCactus() {
    cactusPositionW -= 5; // Move the cactus left by 5px
    // Reset position when cactus moves off-screen
    if (cactusPositionW < -50) { // Cactus width is 25px, so reset at -50px
        cactusPositionW = window.innerWidth; // Reset to starting position
    }

    // Apply the position
    cactus.style.left = `${cactusPositionW}px`; // Use 'left' for positioning
}

function getDinoPosition() {
    const position = {}
    position.Y = parseInt(window.getComputedStyle(dino).bottom, 10); // Get the 'bottom' value and parse it to integer
    position.X = parseInt(window.getComputedStyle(dino).left, 10); // Get the 'bottom' value and parse it to integer
    //console.log('Current Dino position:', position);
    return position;
}

function getCactusPosition() {
    const position = {}
    position.Y = parseInt(window.getComputedStyle(cactus).bottom, 10); // Get the 'bottom' value and parse it to integer
    position.X = parseInt(window.getComputedStyle(cactus).left, 10); // Get the 'bottom' value and parse it to integer
    //console.log('Current Cactus position:', position);
    return position;
}

function checkCollision() {
    //run the checks every 20ms

    let DinoPositionYElement = getDinoPosition().Y
    let DinoPositionXElement = getDinoPosition().X
    DinoPositionElement.innerText = `Current Dino Y position: ${DinoPositionYElement}, X Position: ${DinoPositionXElement}`;
    let CactusPositionYElement = getCactusPosition().Y
    let CactusPositionXElement = getCactusPosition().X
    CactusPositionElement.innerText = `Current Cactus Y position: ${CactusPositionYElement}, X Position: ${CactusPositionXElement}`;

    if (DinoPositionYElement == CactusPositionYElement && (DinoPositionXElement + dinoWidth) == CactusPositionXElement) {
        stopTheGame();
        popUpMenu();
    }
}

function stopTheGame() {
    clearInterval(checkingInterval)
    highScoreArray.push(currentScoreElement.innerText)
    console.log(highScoreArray)
}

let checkingInterval = ""; //to get a global scope

function mainFunction(input) {
    checkingInterval = setInterval(() => {
        //need to convert from string, increment, then update
        let currentScoreFromElement = Number(currentScoreElement.innerText);
        currentScoreFromElement++;
        currentScoreElement.innerText = currentScoreFromElement;

        moveCactus();
        checkCollision();
    }, 20);

}
mainFunction();

function popUpMenu(input) {
    const gameContainerElement = document.getElementById('game-container');
    gameContainerElement.classList.add("gameContainer")

    let popUpMenu = document.createElement("div");
    popUpMenu.classList.add("popUpMenu")
    gameContainerElement.appendChild(popUpMenu);  // Adds the new paragraph inside the parent element

    let leftMenuIcon = document.createElement("img");
    leftMenuIcon.src = "sad dino.gif"
    popUpMenu.appendChild(leftMenuIcon);

    let menuText = document.createElement("div");
    menuText.textContent = "Seems you have hugged a cactus. Ouch.";
    menuText.classList.add("menuText")
    popUpMenu.appendChild(menuText);

    let scoreText = document.createElement("div");
    scoreText.textContent = `The current High Scores: ${highScoreArray}`;
    scoreText.classList.add("scoreText")
    popUpMenu.appendChild(scoreText);
    /*
        let rightMenuIcon = document.createElement("img");
        rightMenuIcon.src="sad dino.gif"
        popUpMenu.appendChild(rightMenuIcon);
    */
    let RestartButton = document.createElement("button");
    RestartButton.textContent = "Restart";
    popUpMenu.appendChild(RestartButton);  // Adds the new paragraph inside the parent element
    restartTheGame(RestartButton,popUpMenu); //adds the eventlistener to the item
}

function restartTheGame(input,popUpMenu) {

        input.addEventListener("click", (e) => {
        console.log(`cliiiick`)

        if (popUpMenu instanceof HTMLElement) {
            popUpMenu.remove(); // Removes the element if it's a valid HTML element
        } else {
            console.log("popUpMenu is not an HTMLElement");
        }
     
        currentScoreElement.innerText = 0;
        dino.style.bottom = '';
        dino.style.right = '';

        mainFunction(); //restarts the game by enabling the SetInterval again.
    });
}