let list = {
    value: 1,
    rest: {
        value: 89,
        rest: {
            value: 3,
            rest: null
        }
    }
};


function nth(list, index) {

    if (index == 0) {
        return list.value;
    } else if (list.rest === null) {
        return null;
    } else {
        return nth(list.rest, index - 1);
    }

}

function arrayToList (array) {
    let list = {
        value: 1,
        rest: null
    };

    for(let i = 0; i < array.length; i++) {
        let index = array.length - i - 1;
        if (i == 0) {
            list.rest = null;
            list.value = array[index];
        } else {
            let tempList = list;
            list = {
                value: array[index],
                rest: list
            };
        }
    }
    return list;
}

function listToArray (list) {
    let array = [];
    let loop = true;
    let counter = 0;
    while (loop) {
        array[counter] = list.value;
        if(list.rest == null) {
            return array;
        }
        list = list.rest;
        counter ++;
    }
}

function prepend (list, element) {
    let temp  = {
        value: element,
        rest: list
    };
    return temp;
}

let arrayList = arrayToList([2,8,12,32]);

console.log(nth(list, 2));
console.log(nth(arrayList, 1))
console.log(JSON.stringify(listToArray(list)));
list = prepend(list, 69);
console.log(JSON.stringify(listToArray(list)));