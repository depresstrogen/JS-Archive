const util = require('util')
function reverseArray(array) {
    let newArray = [];

    for(let i = 0; i < array.length; i++) {
        newArray.push(array[array.length - i - 1]);
    }
    return newArray;
}

function reverseArrayInPlace(array) {
    let tempArray = array.slice(0);
    ;
    for(let i = 0; i < array.length; i++) {
        array[i] = (tempArray[tempArray.length - i - 1]);
    }
}
let array = [1, 2, 3, 4, 5]
let revArray = reverseArray
console.log(JSON.stringify(revArray(array)));
console.log(JSON.stringify(array));
reverseArrayInPlace(array);
console.log(JSON.stringify(array));
