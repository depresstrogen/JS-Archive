//setTimeout(() => console.log("Tick"), 500);

let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));

function factorial(num) {
    let final = num;
    for (let i = num - 1; i > 0; i--) {
        num *= i;
    }
    return num;
}

let fact = Promise.resolve(factorial(100));

fact.then(value => console.log(`Got ${value}`));

console.log("first");

function* powers(n) {
    for (let current = n; ; current *= n) {
        yield current;
    }
}
for (let power of powers(3)) {
    if (power > 50) break;
    console.log(power);
}

function* factorialIt(num) {
    let final = num;
    for (let i = 1; i < num; i++) {
        let current = i;
        for (let j = i - 1; j > 0; j--) {
            current *= j;
        }
        console.log("not in for but: " + current)
        yield current
    }
}
Promise.resolve("Done").then(console.log);

for (let fact of factorialIt(8)) {
    if (fact > 25) {
        break;
    }
    console.log(fact);
}