/** 
* @jest-environment jsdom
 */

// import game obj into test file:
const { game, newGame, showScore, addTurn, lightsOn, showTurns, playerTurn } = require("../game");

jest.spyOn(window, "alert").mockImplementation(() => {

})


beforeAll(() => {
    // this code will be the same for any html file to load into the DOM
    let fs = require("fs");
    let fileContents = fs.readFileSync("index.html", "utf-8");
    document.open();
    document.write(fileContents);
    document.close();
});

describe("game object contains correct keys", () => {
    test("score key exists", () => {
        expect("score" in game).toBe(true);
    });
    test("currentGame key exists", () => {
        expect("currentGame" in game).toBe(true);
    });
    test("playerMoves key exists", () => {
        expect("playerMoves" in game).toBe(true);
    });
    test("choices key exists", () => {
        expect("choices" in game).toBe(true);
    });
    test("choices contains correct ids", () => {
        expect(game.choices).toEqual(["button1", "button2", "button3", "button4"]);
    });
    test("turnNumber key exists", () => {
        expect("turnNumber" in game).toBe(true);
    });
    test("last button key exists", () => {
        expect("lastButton" in game).toBe(true);
    });
    test("turnInProgress key exists", () => {
        expect("turnInProgress" in game).toBe(true);
    });
    test("turnInProgress key value is false", () => {
        expect("turnInProgress" in game).toBe(true);
    })
});

describe("newGame works correctly", () => {
    beforeAll(() => {
        game.score = 42;
        game.playerMoves = ["button1", "button2"];
        game.currentGame = ["button1", "button2"];
        // set score on DOM to 42 so we can see if it gets reset to 0 by newGame()
        document.getElementById("score").innerText = "42";
        newGame();
    });
    test("should set game score to zero", () => {
        expect(game.score).toEqual(0);
    });
    test("should be 1 move in the computer's game array", () => {
        expect(game.currentGame.length).toBe(1);
    })
    test("should clear the player moves array", () => {
        expect(game.playerMoves.length).toBe(0);
    });
    test("should display 0 for the element with the id of score", () => {
        expect(document.getElementById("score").innerText).toEqual(0);
    });
    test("expect data-listener to be true", () => {
        // get all elements with class of circle, stored in elements
        // loop through elements to see if div data-listener is set to true
        const elements = document.getElementsByClassName("circle");
        for (let element of elements) {
            // expect attribute of element to be set to true
            expect(element.getAttribute("data-listener")).toEqual("true");
        }
    });
});

describe("gameplay works correctly", () => {
    // beforeEach runs before each test is run
    beforeEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
        addTurn();
    });
    // reset state again after each test
    afterEach(() => {
        game.score = 0;
        game.currentGame = [];
        game.playerMoves = [];
    });
    test("addTurn adds a new turn to the game", () => {
        addTurn();
        expect(game.currentGame.length).toBe(2);
    });
    test("should add correct class to light up the buttons", () => {
        let button = document.getElementById(game.currentGame[0]);
        lightsOn(game.currentGame[0]);
        expect(button.classList).toContain("light");
    });
    test("showTurns should update game.turnNumber", () => {
        game.turnNumber = 42;
        showTurns();
        expect(game.turnNumber).toBe(0);
    });
    test("should increment the score if turn is correct", () => {
        game.playerMoves.push(game.currentGame[0]);
        playerTurn();
        expect(game.score).toBe(1);
    });
    test("should call an alert if the move is wrong", () => {
        // instead of pushing correct move in playerMoves arr, we push incorrect string
        game.playerMoves.push("wrong");
        playerTurn();
        // expecting alert box with following text
        expect(window.alert).toBeCalledWith("Wrong move!");
    });
    test("check if turnInProgress key is set to true", () => {
        showTurns();
        expect(game.turnInProgress).toBe(true);
    });
    test("clicking during computer sequence should fail", () => {
        showTurns();
        // if clicks are disabled contents of lastButton shouldn't change
        game.lastButton = "";
        document.getElementById("button2").click();
        expect(game.lastButton).toEqual("");
    });
});