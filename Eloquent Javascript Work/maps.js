let memes = {
    nineTen: 21,
    sex: 69,
    weed: 420
};

console.log(memes["weed"]);       // Get value
console.log("deez" in memes);     // Search for instance of this
console.log("sex" in memes); 
console.log("toString" in memes); // Because everything inherits from object, technically speaking toString is there

let memes2 = new Map(); //So theres a map class to deal with this bullshit
memes2.set("nineTen", 21);
memes2.set("sex", 69);
memes2.set("weed", 420);

console.log(memes2.get("weed"));     // Get value
console.log(memes2.has("deez"));     // Search for instance of this
console.log(memes2.has("sex"));
console.log(memes2.has("toString")); // No longer shows false positive

console.log(memes.hasOwnProperty("nineTen"));   //Kinda aaaaaa solution if you hate objects
console.log(memes.hasOwnProperty("toString"));