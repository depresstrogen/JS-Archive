class MultiplicatorUnitError extends Error {}

function shittyMultiply(a, b) {
    let chance = Math.random() * 5;
    if (chance < 1) {
        return a * b;
    }
    throw new MultiplicatorUnitError("Bad Multiplication Luck");
}

function sob(a, b) {
    for(;;) {
        try {
            return shittyMultiply(a,b);       
        } catch (e) {
            if(e instanceof MultiplicatorUnitError) {
                console.log("tried");
            } else {
                throw e;
            }
        }
    }
}

console.log(sob(5,5));