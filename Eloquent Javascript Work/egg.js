function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;
    /*
    /^"([^"]*)"/
     ^ = Start Of line
     " = Quote Char
     ([^""]) = Group of range ^ and "
     * = 0 or More
     " = Quote Char
    */
    if (match = /^"([^"]*)"/.exec(program)) {
        expr = { type: "value", value: match[1] };
        console.log("-a- " + program);

        /*
        /^\d+\b/
        ^ = Start of line
        \d = Decimal
        + = 1 or more
        \b = Word Boundry
        If there is a decimal and then not a word
        */
    } else if (match = /^\d+\b/.exec(program)) {
        // Value = the number closest to the left
        expr = { type: "value", value: Number(match[0]) };
        console.log("-b- " + match[0] + " -- " + program);

        /*
        /^[^\s(),#"]+/
        ^ = Start of line
        [ = Range of
            ^ = Start of Line
            \s white Space
            ().# = These Characters
        ]
    
        
        */
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        //Name = the start of the line until ^\s(),#" character appears
        expr = { type: "word", name: match[0] };
        console.log("-c- " + expr.name + " -- " + program);
    } else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }
    return parseApply(expr, program.slice(match[0].length)); // Returns a object after parsing
}


function skipSpace(string) {
    //Looks for no white space
    let first = string.search(/\S/);
    //If just white space its empty
    if (first == -1) return "";
    // Returns the a string sliced at the first non white space char
    return string.slice(first);
}

function parseApply(expr, program) {
    program = skipSpace(program);
    //If there is no bracket just return the expression
    if (program[0] != "(") {
        return { expr: expr, rest: program };
    }
    //Remove white space
    program = skipSpace(program.slice(1));
    // It has a bracket so the type is "Apply"
    // Operator is the expression
    // Args is Empty
    expr = { type: "apply", operator: expr, args: [] };
    // Until the end of the line which is always )
    while (program[0] != ")") {
        //Next argument is the next thing to parse
        let arg = parseExpression(program);
        // Push to Expression Array
        expr.args.push(arg.expr);
        // Remove white space from remaining part of the line
        program = skipSpace(arg.rest);
        // Remove , if there is one
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
            // If there is no , or ) throw an error
            // If it is ) the while condition will work with that
        } else if (program[0] != ")") {
            throw new SyntaxError("Expected ',' or ')'");
        }
    }
    // Remove this line from the remaining program and parse again (This is the loop)
    return parseApply(expr, program.slice(1));
}

function parse(program) {
    let { expr, rest } = parseExpression(program);
    if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

const specialForms = Object.create(null);
function evaluate(expr, scope) {
    // A value expresses to it's self
    if (expr.type == "value") {
        return expr.value;
        // If the expression is a variable
    } else if (expr.type == "word") {
        //If it has been defined
        if (expr.name in scope) {
            // Return the expression's value
            return scope[expr.name];
        } else {
            // Else you fucked up
            throw new ReferenceError(
                `Undefined binding: ${expr.name}`);
        }
        // If it is a command (if while etc)
    } else if (expr.type == "apply") {
        let { operator, args } = expr;
        // Commands are defined in specialForms
        if (operator.type == "word" &&
            // If it is a valid command
            operator.name in specialForms) {
            // Do the function with the name of that command
            return specialForms[operator.name](expr.args, scope);
        } else {
            let op = evaluate(operator, scope);
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError("Applying a non-function.");
            }
        }
    }
}

specialForms.if = (args, scope) => {
    //If needs 3 args
    if (args.length != 3) {
        throw new SyntaxError("Wrong number of args to if");
        // If the first is true, it returns the second argument
    } else if (evaluate(args[0], scope) !== false) {
        return evaluate(args[1], scope);
        // Else it returns the third argument
    } else {
        return evaluate(args[2], scope);
    }
};

specialForms.while = (args, scope) => {
    // While required 2 args
    if (args.length != 2) {
        throw new SyntaxError("Wrong number of args to while");
    }
    //Throws it in a while loop
    //if the first argument still evaluates to true
    while (evaluate(args[0], scope) !== false) {
        // Do whatever is in the second argument
        evaluate(args[1], scope);
    }
    // Since undefined does not exist in Egg, we return false, for lack of a meaningful result.
    return false;
};

// Performs whatever is in the brackets
specialForms.do = (args, scope) => {
    let value = false;
    // Does every argument
    for (let arg of args) {
        value = evaluate(arg, scope);
    }
    return value;
};

// Defines a variable in memory
specialForms.define = (args, scope) => {
    // Throw error if incorrect
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of define");
    }
    // Evaluate the second argument
    let value = evaluate(args[1], scope);
    // Put that evaluation into the name given by the first, into the scope
    scope[args[0].name] = value;
    return value;
};

// Functions <3
specialForms.fun = (args, scope) => {
    // If empty error
    if (!args.length) {
        throw new SyntaxError("Functions need a body");
    }
    // Number of arguments in the function
    let body = args[args.length - 1];
    // Paramaters = a map
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });
    // Make JS function out of it
    return function () {
        // Error if params and arguments length dont match
        if (arguments.length != params.length) {
            throw new TypeError("Wrong number of arguments");
        }
        // Local scope instead of global scope
        let localScope = Object.create(scope);
        for (let i = 0; i < arguments.length; i++) {
            // Turns each paramater into arguments to run when called, in the local scope
            localScope[params[i]] = arguments[i];
        }
        // Finally evaluate this
        return evaluate(body, localScope);
    };
};

// Defines global scope
const topScope = Object.create(null);

// Puts true fals constants into global scope
topScope.true = true;
topScope.false = false;

// Puts arithmetic and comparison operators
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    // Uses JS's function maker to turn strings into functions
    // These can be called by using topscope[operator]
    topScope[op] = Function("a, b", `return a ${op} b;`);
}

// Just puts console.log into scope
topScope.print = value => {
    console.log(value);
    return value;
};

// Takes program as a string and runs it
function run(program) {
    return evaluate(parse(program), Object.create(topScope));
}

// Factorial
console.log(run(`
    do(define(total, 1),
        define(count, 2),
        while(<(count, +(10,1)),
            do(define(total, *(total, count)),
                define(count, +(count, 1))
                )
            ),
    print(total)
)
`));

// Powers (w/ Functions)
run(`
do(define(pow, fun(base, exp,
    if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))
    ))),
    print(pow(2, 10))
)
`);