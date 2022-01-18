

export function buildGraph(edges) { // Forms 2d array of [each house, each house it can go to]
    let graph = Object.create(null); // Make array to return
    function addEdge(from, to) {
        if (graph[from] == null) { // If no array make one
            graph[from] = [to];
        } else {                   // If there is an array push another value
            graph[from].push(to);  // Pushes the house you can reach to the array of the house it is at
        }
    }
    /*
        Makes 2 element array [from,to]
        Goes through each element of edges (the roads)
        Splits each at the dash
        Loops until array is over
    */
    for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to); //Adds both possible combos
        addEdge(to, from);
    }

    return graph; // Returns the 2d array
}
