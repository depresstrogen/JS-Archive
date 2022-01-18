function deepEqual (obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    } else if (Object.keys(obj1) == Object.keys(obj2)) {
        return true;
    } else {
        return false;
    }
}

let list1 = {
    value: 1,
    rest: {
        value: 89,
        rest: {
            value: 3,
            rest: null
        }
    }
};

let list2 = {
    value: 1,
    rest: {
        value: 89,
        rest: {
            value: 3,
            rest: null
        }
    }
};

console.log(deepEqual(list1, list2))
list2.value = 3;
console.log(deepEqual(list1, list2))