function range(start, end, step) {
    let array = [];
    if (step > 0) {
        for (let i = start; i <= end; i += step) {
            array.push(i);
        }
    }
    else {
        for (let i = end; i >= start; i += step) {
            array.push(i);
        }
    }
    return array;
}
console.log(range(20, 25, -3));