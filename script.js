var model = {
    boardSize: 7,
    numShips: 3,
    ships: [{location: ['', '', ''], hits: ["", "", ""]},
            {location: ['', '', ''], hits: ["", "", ""]},
            {location: ['', '', ''], hits: ["", "", ""]}],
    shipSunk: 0,
    shipLength: 3,
    fire: function(guess){
        for(var i = 0; i < this.ships.length; i++){
            var index = this.ships[i].location.indexOf(guess);
            console.log(index);
            if(index >= 0){
                this.ships[i].hits[index] = "hit";
                view.displayHit(guess);
                if(this.isSunk(this.ships[i])){
                    this.shipSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        return false;
    },
    isSunk: function(ship, index){
        for(var i = 0; i < ship.hits.length; i++){
            if(ship.hits[i] != "hit"){
                return false;
            }
        }

        return true;
    },
    generateShipLocations: function(){
        var locations;
        for(var i = 0; i < this.numShips; i++){
            do{
                locations = this.generateShip();
            }while(this.collision(locations));
            this.ships[i].location = locations;
        }
    },
    generateShip: function(){
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        var validInputs = ["a", "b", "c", "d", "e", "f", "g"]
        if(direction === 1){
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength+1)));
        }else{
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength+1)));
            col = Math.floor(Math.random() * this.boardSize);
        }

        
        var newShipLocations = [];
        for(var i = 0; i < this.shipLength; i++){
            if(direction === 1){
                newShipLocations.push(validInputs[row] + "" + (col+i));
            }else{
                newShipLocations.push(validInputs[(row+i)] + "" + col);
            }
        }

        return newShipLocations;
    }, 
    collision: function(newShip){
        for(var i = 0; i < this.numShips; i++){
            var ship = this.ships[i];
            for(var j = 0; j < location.length; j++){
                if(ship.location.indexOf(location[j]) >= 0){
                    return true;
                }
            }
        }
    }
}

var view = {
    displayMessage: function(msg){
        var message = document.getElementById("message");
        message.innerHTML = msg;
    },

    displayHit: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
        this.displayMessage("That was a hit!!");
    },

    displayMiss: function(location){
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
        this.displayMessage("That was a miss :(");
    }
}


var controller = {
    guesses: 0,
    processGuess: function(playerGuess){
        var location = parseGuess(playerGuess);
        if(location === "invalid"){
            view.displayMessage("Invalid!!");
        }

        if(location){
            this.guesses++;
            var hit = model.fire(location);
            if(hit && model.shipSunk === model.numShips){
                view.displayMessage("You sank all my ships, in " + 
                                        this.guesses + " guesses.");
            }
        }
    }
}

function parseGuess(playerGuess){
    if(playerGuess.length > 2 || playerGuess.guess === null){
        return "invalid";
    }
    var char1 = playerGuess.charAt(0);
    var char2 = playerGuess.charAt(1);

    var validInputs = ["a", "b", "c", "d", "e", "f", "g",
                       "A", "B", "C", "D", "E", "F", "G"];

    var validC1 = false;
    var idxOfC1 = validInputs.indexOf(char1); 
    if( idxOfC1 >= 0){
        validC1 = true;
    }
    if(validC1 && idxOfC1 > 6){
        char1 = validInputs[idxOfC1-model.boardSize];
    }

    char2 = Number(char2);
    var validC2 = false;
    if(char2 >= 0 && char2 <= model.boardSize-1){
        validC2 = true;
    }

    var parsedGuess = char1+char2;
    if(validC1 && validC2){
        return parsedGuess;
    }
    
    return "invalid";
}

function init(){
    var button = document.getElementById("fireButton");
    button.onclick = handleFireButton;

    model.generateShipLocations();
}

function handleFireButton(){
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    console.log(guess);
    guessInput.value = "";
}

window.onload = init;