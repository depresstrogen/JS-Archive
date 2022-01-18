
import {getRoads} from './roadgraph.js';



const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
]; // Route between every building

const roadGraph = getRoads(); // Builds 2d array from human readable form

class vState { //Store Village State
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }

    move(destination) {
        if (!roadGraph[this.place].includes(destination)) {
            //If we can not get to the desired place return where we already are
            return this;
        } else {
            let parcels = this.parcels.map(p => { //Goes through each parcel
                if (p.place != this.place) return p;  //If the parcel doesnt go to the current location keep as is
                return { place: destination, address: p.address }; // Else make it fail the filter
            }).filter(p => p.place != p.address);
            return new vState(destination, parcels); // Applies parcel state to village
        }
    }
}

function runRobot(state, robot, memory) {
    if (memory == undefined) {
        memory = []; // Memory can not be undefined
    }
    for (let turn = 0; ; turn++) { // Loop until break
        if (state.parcels.length == 0) { // Stop if no more parcels
            console.log(`Done in ${turn} turns`);
            return turn;
        }

        let action = robot(state, memory); // Runs the selected ai (memory use is optional) and makes it the next action
        state = state.move(action.direction); // Perform the move and set the state
        memory = action.memory;               // Steals the memory for next loop
        console.log(`Moved to ${action.direction}`);
    }
}

function randomPick(array) { //Picks random index on an array
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    /*
    Returns an object with one direction variable
    The variable is made from picking a random index of the states current place
    */
    return { direction: randomPick(roadGraph[state.place]) };
}

function routeRobot(state, memory) {
    // Memory is an array of the mail route
    if (memory.length == 0) { //Ensures the above if the array is empty
        memory = mailRoute;
    }
    /*
    Makes the direction the 0 index of the array
    Then slices the 0 index off so the new 0 index is the next in the mailRoute
    */
    return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
    let work = [{ at: from, route: [] }]; // Work List, Avoids any "from" point on this list
    for (let i = 0; i < work.length; i++) { //Basically loops until a return
        let { at, route } = work[i]; // Goes to next place on work list, never return back after this
        for (let place of graph[at]) { // Let place = Each place you can go to from where you are
            //console.log(place);
            //console.log(graph[at]);
            if (place == to) {
                //console.log(JSON.stringify(work));
                return route.concat(place); //If it is at the destination return the route
            }
            if (!work.some(w => w.at == place)) { //If worklist does not have this place, add it
                work.push({ at: place, route: route.concat(place) });
            }
        }
    }
}

function goalOrientedRobot({ place, parcels }, route) {
    //If it is done giving the last route
    if (route.length == 0) {

        let parcel = parcels[0]; // Takes next parcel
        if (parcel.place != place) {  //If it has to pick it up
            route = findRoute(roadGraph, place, parcel.place); //Find a way to pick it up
        } else { //If it has to deliver
            route = findRoute(roadGraph, place, parcel.address); //Find a way to deliver
        }
    }
    // Gives the direction as the next thing in route, removes it from memory
    return { direction: route[0], memory: route.slice(1) };
}

function moddedGoalOrientedRobot({ place, parcels }, route) {
    if (route.length == 0) {
        let shortestRouteIndex = -1;
        let shortestRoute = route;
        let shortestIsPickup = false;
        for (let i = 0; i < parcels.length; i++) { // Loops through all packages instead of package 0
            
            let parcel = parcels[i];
            if (parcel.place != place) {
                route = findRoute(roadGraph, place, parcel.place);
            } else {
                route = findRoute(roadGraph, place, parcel.address);
            }
            
            if(route.length < shortestRoute.length || shortestRouteIndex == -1) { //Finds shortest one
                shortestRouteIndex = i;
                shortestRoute = route;
                if(parcel.place != place) {  // If it is a pickup
                    shortestIsPickup = true;
                } else {
                    shortestIsPickup = false;
                }
            } else if (route.length == shortestRoute.length && !shortestIsPickup && parcel.place != place) { //Prioritizes picking up a package rather than delivering
                shortestRouteIndex = i;
                shortestRoute = route;
                shortestIsPickup = false;
            }

        }
        route = shortestRoute; // Makes the route the shortest route
    }
    return { direction: route[0], memory: route.slice(1) };
}

function compareRobots(robot1, robot2) {
    let numTests = 1000;
    let aTotal = 0;
    let bTotal = 0;
    for (let i = 0; i < numTests; i++) {
        let state = vState.random();
        aTotal += runRobot(state, robot1);
        bTotal += runRobot(state, robot2);
    }
    console.log("Robot A Avg = " + (aTotal / numTests) + " Robot B Avg = " + (bTotal / numTests));
}

// Gives vState a randomizer function
vState.random = function (parcelCount = 5) {
    let parcels = []; // Blank parcel array
    for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph)); //Object.keys gets an array of each name on the road graph
        let place; // The destination
        do {
            place = randomPick(Object.keys(roadGraph)); // Picks a destination
        } while (place == address); // Make sure destination is not the sender (address)
        parcels.push({ place, address }); // Append to the parcel array
    }
    return new vState("Post Office", parcels); // Always starts at post office
};

compareRobots(goalOrientedRobot, moddedGoalOrientedRobot);

/* 
random = 68.1 ish
route = 18.1 ish
goalOriented = 14.7 ish
moddedGoalOrientedRobot = 12.0 ish
*/
