for(let i = 0; i < 8; i++) {
    let line = ''
    for(let j = 0; j < 8; j++) {
        if ((j - (i % 2)) % 2 == 0) {
            /*
            J is left to right
            I is up and down
            if I is odd flip the order
            if the expression is odd put a #
            */
            line += ' ';
        } else {
            line += '#';
        }
    }
    console.log(line);
}