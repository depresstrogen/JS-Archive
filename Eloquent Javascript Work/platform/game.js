
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;


let lives = 3;

// Level Class
class Level {
    constructor(plan) {
        //Split string into an array of rows split by new line
        let rows = plan.trim().split("\n").map(l => [...l]);
        //Set variables
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];

        // Make rows = rows.map to a function
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                //Find the type in levelChars
                let type = levelChars[ch];
                //If it is a block (Is a string)
                if (typeof type == "string") return type;
                // else it is an actor
                //Add actor to array
                this.startActors.push(
                    // Make actor
                    type.create(new Vec(x, y), ch));
                //No block
                return "empty";
            });
        });
        //Now it is an array of strings corrosponding to blocks
    }
}

// Game State
class State {
    // Set Vars
    constructor(level, actors, status) {
        this.level = level;
        this.actors = actors;
        this.status = status;
    }
    // Makes a default state
    static start(level) {
        return new State(level, level.startActors, "playing");
    }
    // Get player object
    get player() {
        return this.actors.find(a => a.type == "player");
    }
}

// Basic vector class
class Vec {
    // X Y coords
    constructor(x, y) {
        this.x = x; this.y = y;
    }
    //(x1 + x2, y1 + y2)
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }
    //(x1 * x2, y1 * y2)
    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }
}

//Player class
class Player {
    // Position (vec) and speed
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }
    // Get string
    get type() {
        return "player";
    }
    //Makes defualt player
    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)),
            new Vec(0, 0));
    }
}
// Default size
Player.prototype.size = new Vec(0.8, 1.5);

//Lava Class
class Lava {
    constructor(pos, speed, reset) {
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }
    //Get string
    get type() {
        return "lava";
    }
    // Create lava
    static create(pos, ch) {
        //Speed of lava
        if (ch == "=") {
            return new Lava(pos, new Vec(2, 0));
        } else if (ch == "|") {
            return new Lava(pos, new Vec(0, 2));
        } else if (ch == "v") {
            return new Lava(pos, new Vec(0, 3), pos);
        }
    }
}
//Default size
Lava.prototype.size = new Vec(1, 1);


// Coin class
class Coin {

    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;

        this.wobble = wobble;
    }
    //Get String
    get type() {
        return "coin";
    }
    //Make coin
    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(basePos, basePos,
            //Random wobble
            Math.random() * Math.PI * 2);
    }
}
// Default coin size
Coin.prototype.size = new Vec(0.6, 0.6);

var levelChars = {
    ".": "empty", "#": "wall", "+": "lava",
    "@": Player, "o": Coin,
    "=": Lava, "|": Lava, "v": Lava
};

var simpleLevel = new Level(simpleLevelPlan);

// Make Element
function elt(name, attrs, ...children) {
    // Create element of tpe name
    let dom = document.createElement(name);
    //for each attribute in array attrs, set it
    for (let attr of Object.keys(attrs)) {
        dom.setAttribute(attr, attrs[attr]);
    }
    // Add children
    for (let child of children) {
        dom.appendChild(child);
    }
    //Return this node
    return dom;
}

// Use dom as display
class DOMDisplay {
    constructor(parent, level) {
        // This dom = new game div element with children of draw grid (all elements of game)
        this.dom = elt("div", { class: "game" }, drawGrid(level));
        this.actorLayer = null;
        // Append this to patent
        parent.appendChild(this.dom);
    }
    // Clear Screen
    clear() {
        this.dom.remove();
    }
}
// Each box size
const scale = 20;

// Draws grid
function drawGrid(level) {
    // Return element of table
    return elt("table", {
        // These css params
        class: "background",
        style: `width: ${level.width * scale}px`
        // With children of each row
    }, ...level.rows.map(row =>
        // Makes new element tr for each row which is blank 
        elt("tr", { style: `height: ${scale}px` },
            // Makes new element td for each column in row
            ...row.map(type => elt("td", { class: type })))
    ));
}

// Draw the actors
function drawActors(actors) {
    // Make actor grid (no css)
    return elt("div", {}, ...actors.map(actor => {
        // for each actor make a div for the actor
        let rect = elt("div", { class: `actor ${actor.type}` });
        // Apply Size
        rect.style.width = `${actor.size.x * scale}px`;
        rect.style.height = `${actor.size.y * scale}px`;
        rect.style.left = `${actor.pos.x * scale}px`;
        rect.style.top = `${actor.pos.y * scale}px`;
        return rect;
    }));
}

// Sync State
DOMDisplay.prototype.syncState = function (state) {
    // if there is a actor layer, remove it
    if (this.actorLayer) this.actorLayer.remove();
    // make new layer
    this.actorLayer = drawActors(state.actors);
    // append it to game div
    this.dom.appendChild(this.actorLayer);
    // rename game div to the status
    this.dom.className = `game ${state.status}`;
    this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
    // Screen Width
    let width = this.dom.clientWidth;
    let height = this.dom.clientHeight;
    let margin = width / 3;
    // The viewport
    let left = this.dom.scrollLeft, right = left + width;
    let top = this.dom.scrollTop, bottom = top + height;
    let player = state.player;

    // Center of player
    let center = player.pos.plus(player.size.times(0.5))
        .times(scale);

    // OOB Checks
    if (center.x < left + margin) {
        this.dom.scrollLeft = center.x - margin;
    } else if (center.x > right - margin) {
        this.dom.scrollLeft = center.x + margin - width;
    }
    if (center.y < top + margin) {
        this.dom.scrollTop = center.y - margin;
    } else if (center.y > bottom - margin) {
        this.dom.scrollTop = center.y + margin - height;
    }
};

Level.prototype.touches = function (pos, size, type) {
    // Furthelst left box the actor is touching
    let xStart = Math.floor(pos.x);
    // Furthest right box its touching
    let xEnd = Math.ceil(pos.x + size.x);
    // Lowest box it is touching
    let yStart = Math.floor(pos.y);
    // Highest box it is touching
    let yEnd = Math.ceil(pos.y + size.y);
    // For each box
    for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {

            let isOutside = x < 0 || x >= this.width ||
                y < 0 || y >= this.height;
            //If is outside is true, make it a wall, else get the type
            let here = isOutside ? "wall" : this.rows[y][x];
            // if the type you are looking for is in the grid square return true
            if (here == type) return true;
        }
    }
    // Else return false
    return false;
};

// Update game state
State.prototype.update = function (time, keys) {
    //Update Actors
    let actors = this.actors
        .map(actor => actor.update(time, this, keys));
    // Make the new state with new actors
    let newState = new State(this.level, actors, this.status);

    // If not playing return right here
    if (newState.status != "playing") return newState;

    // Check lava colision
    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava")) {
        return new State(this.level, actors, "lost");
    }

    //For each actor
    for (let actor of actors) {
        // If its not the player and touching the player
        if (actor != player && overlap(actor, player)) {
            // Run collide function
            newState = actor.collide(newState);
        }
    }
    return newState;
};

// See if overlaps
function overlap(actor1, actor2) {
    // Returns true if the 2 are colliding
    return actor1.pos.x + actor1.size.x > actor2.pos.x &&
        actor1.pos.x < actor2.pos.x + actor2.size.x &&
        actor1.pos.y + actor1.size.y > actor2.pos.y &&
        actor1.pos.y < actor2.pos.y + actor2.size.y;
}

// Lava collide function
Lava.prototype.collide = function (state) {
    // Make lost state
    return new State(state.level, state.actors, "lost");
};

// Coin collide function
Coin.prototype.collide = function (state) {
    // Get all actors that arent this
    let filtered = state.actors.filter(a => a != this);
    // Get current status
    let status = state.status;
    // if no more coins, set to won
    if (!filtered.some(a => a.type == "coin")) status = "won";
    // return state without this coin
    return new State(state.level, filtered, status);
};

// Lava update function
Lava.prototype.update = function (time, state) {
    // Make new position = speed * time passed
    let newPos = this.pos.plus(this.speed.times(time));
    // If not touching wall det new position
    if (!state.level.touches(newPos, this.size, "wall")) {
        return new Lava(newPos, this.speed, this.reset);
        // If set to reset, reset
    } else if (this.reset) {
        return new Lava(this.reset, this.speed, this.reset);
        // Else move the other direction
    } else {
        return new Lava(this.pos, this.speed.times(-1));
    }
};

// Constants for coin wobble
var wobbleSpeed = 8, wobbleDist = 0.07;

// Coin update function
Coin.prototype.update = function (time) {
    // Set wobble with the time
    let wobble = this.wobble + time * wobbleSpeed;
    // Make the coin modifier = y axis of wobble
    let wobblePos = Math.sin(wobble) * wobbleDist;
    // Make new coin with the wobble
    return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
        this.basePos, wobble);
};

// Player constants
var playerXSpeed = 7;
var gravity = 30;
var jumpSpeed = 17;

// Player update function
Player.prototype.update = function (time, state, keys) {
    // Speed
    let xSpeed = 0;
    // If arrow keys are pressed, adjust speed
    if (keys.ArrowLeft) xSpeed -= playerXSpeed;
    if (keys.ArrowRight) xSpeed += playerXSpeed;
    // Get position
    let pos = this.pos;
    // Add speed * time to position
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    // If not hitting a wall, move
    if (!state.level.touches(movedX, this.size, "wall")) {
        pos = movedX;
    }

    //
    let ySpeed = this.speed.y + time * gravity;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    // If not hitting wall
    if (!state.level.touches(movedY, this.size, "wall")) {
        pos = movedY;
        // If arrow up is hit
    } else if (keys.ArrowUp && ySpeed > 0) {
        // Make jump speed negative (up)
        ySpeed = -jumpSpeed;
        // Else cancel speed
    } else {
        ySpeed = 0;
    }
    //Return player with changes
    return new Player(pos, new Vec(xSpeed, ySpeed));
};

// Key Listener Function
function trackKeys(keys) {
    // Down = array of keys
    let down = Object.create(null);
    function track(event) {
        // If keys includes the event
        if (keys.includes(event.key)) {
            // add if the key is down to that array
            down[event.key] = event.type == "keydown";
            // Avoid page scrolling
            event.preventDefault();
        }
    }
    // Add event listeners to key down and up
    window.addEventListener("keydown", track);
    window.addEventListener("keyup", track);
    // return array
    return down;
}
let pauseState = false;
let newState = undefined;
function trackPause() {

    window.addEventListener("keyup", event => {
        if (event.key == "Escape") {
            pauseState = !pauseState;
            if (pauseState) {
                newState = "paused";
            } else {
                newState = "playing";
            }
        }
    })
}

// Makes track keys available to everyone
var arrowKeys =
    trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);

// Update screen
function runAnimation(frameFunc) {
    let lastTime = null;
    function frame(time) {
        // If lastTime has been set
        if (lastTime != null) {
            // Step time forward
            let timeStep = Math.min(time - lastTime, 100) / 1000;
            // Checks state and if dead close the loop
            if (frameFunc(timeStep) === false) return;
        }
        // Set last time to current time
        lastTime = time;
        // Causes loop
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}

function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
        runAnimation(time => {
            if (newState != undefined) {
                console.log("AAAAAA");
                state = new State(state.level, state.actors, newState);
                newState = undefined;
                display.syncState(state);
            }
            // Update state with timeStep
            if (!pauseState) {
                state = state.update(time, arrowKeys);
                display.syncState(state);
            }
            // If still playing return true
            if (state.status == "playing") {
                return true;
                // If paused do nothing
            } else if (state.status == "paused") {
                return true
                // If dead wait until a second has passed
            } else if (ending > 0) {
                ending -= time;
                return true;
                // If second passed, clear display
            } else {
                if(state.status != "won") {
                    lives --;
                }
                if (lives <= 0) {
                    state = new State(state.level, state.actors, "gameover");
                }
                display.clear();
                resolve(state.status);
                return false;
            }
        });
    });
}

//Runs game with multiple levels
async function runGame(plans, Display) {
    trackPause();
    // Start at lvl 0, for loop with the rest of things
    for (let level = 0; level < plans.length;) {
        console.log("Current lives: " + lives);
        // Runs level, and sets status when it returns
        let status = await runLevel(new Level(plans[level]),
            Display);
        // If you won, increase the level
        if (status == "won") level++;
        // If you died, stop the game loop
        if (status == "gameover") break;
        // Else restart the current level
    }
    // End of game
    if (lives > 0) {
        console.log("You've won!");
    } else {
        console.log("You are a failure");
    }
}
