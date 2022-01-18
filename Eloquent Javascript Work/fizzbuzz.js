for(let i = 1; i <= 100; i++) {
    let printnum = true;
    let line = '';
    if(i % 3 == 0) {
        line += "Fizz";
        printnum = false;
    }
    if(i % 5 == 0) {
        line += "Buzz";
        printnum = false;
    }
    if (printnum == true) {
        line += i;
    }
    console.log(line);
}