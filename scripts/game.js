let game = {
    score: 0,
    currentGame: [],
    playerMoves: [],
    turnNumber: 0,
    lastButton: "",
    turnInProgress: false,
    choices: ["button1", "button2", "button3", "button4"],
};

function newGame() {
    game.score = 0;
    game.currentGame = [];
    game.playerMoves = [];
    // get all elements with class name "circle", if attribute is set to false, we add event listener
    for (let circle of document.getElementsByClassName("circle")) {
        if (circle.getAttribute("data-listener") !== "true") {
            // e means event object (click object)
            circle.addEventListener("click", (e) => {
                // we allow click if game not in progress
                if (game.currentGame.length > 0 && !game.turnInProgress) {
                // get click targets id, depending on which circle we click the id will be btn1, btn2, etc
                let move = e.target.getAttribute("id");
                game.lastButton = move;
                // call lightsOn with move, illuminating the correct circle
                lightsOn(move);
                // push that move into game.playerMoves
                game.playerMoves.push(move);
                // call playerTurn()
                playerTurn();
                }
            });
            // set data listener attribute on circle to true
            circle.setAttribute("data-listener", "true");
        }
    }
    showScore();
    addTurn();
};

function showScore() {
    document.getElementById("score").innerText = game.score;
}

function addTurn() {
    game.playerMoves = [];
    /* push into computer game sequence, game.choices key contains ids of buttons, use math random to generate random number between 0-3,
    use that as the index of our choices array, and the resulting choice is pushed up into current game array
    newGame is clearing out our fake data from currentGame arr and then addTurn() is pushing a random choice
    */
    game.currentGame.push(game.choices[(Math.floor(Math.random() * 4))]);
    showTurns();
}

function lightsOn(circ) {
    document.getElementById(circ).classList.add("light");
    // after 400 milliseconds, remove light class 
    setTimeout(() => {
        document.getElementById(circ).classList.remove("light");
    }, 400);
}

function showTurns() {
    // set turnInProgress to true because turns have started
    game.turnInProgress = true;
    game.turnNumber = 0;
    // setting interval, turning lights on, incrementing game turn number then switching off lights
    let turns = setInterval(() => {
        lightsOn(game.currentGame[game.turnNumber]);
        game.turnNumber++;
        // if turnNumber is >= length of currentGame arr the seq is finished so we can clear our interval
        if (game.turnNumber >= game.currentGame.length) {
            clearInterval(turns);
            game.turnInprogress = false;
        }
    }, 800);
}

function playerTurn() {
    // get index of last element from playerMoves arr
    let i = game.playerMoves.length -1;
    // compare index of last element with same index in currentGame arr, if player gets answers correct these should match
    if (game.currentGame[i] === game.playerMoves[i]) {
        if (game.currentGame.length == game.playerMoves.length) {
            // if length of currentGame arr is equal to length of playerMoves we are at end of sequence and player got all correct
            // now we can increment the score and add a new turn
            game.score++;
            showScore();
            addTurn();
        }
    } else {
        // alert wrong move and begin new game
        alert("Wrong move!");
        newGame();
    }
}

// export game object into test file
module.exports = { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn};

