class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    printPoints() {
        console.log("The points are (" + this.x + ", " + this.y + ")");
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

let myPoint = new Point(50, 69);
myPoint.printPoints();
console.log(Object.getPrototypeOf(myPoint) == Point.prototype);   // Like java has extends, prototypes are like the super class of something
console.log(Object.getPrototypeOf(Point) == Function.prototype);  // Like everything extends object eventually in java, everything extends Object.prototype
console.log(Object.getPrototypeOf(Object.prototype));             // This is null because of that

console.log("-------- (1)");

Point.prototype.z = 1;  // Sets the default Z value to 1 as it is optional
console.log(myPoint.z); // This wasnt declared anywhere for myPoint, it gets it from the prototype
myPoint.z = 0;          // Can still set it whenever you want
console.log(myPoint.z);

console.log("-------- (2)");

console.log(Array.prototype.toString == Object.prototype.toString); // Array overrides the Object toString method
console.log([1, 2].toString());                                     // Gives the array sting method
console.log(Object.prototype.toString.call([1, 2]));                // Takes the object to a string not the actual contents of the array
console.log(String(myPoint))                                        // Custom to string method

console.log("-------- (3)");

let sym = Symbol("point");              // Symbols can only be made once
console.log(sym == Symbol("point"));    // Doesnt equal a new one of the same name
Point[sym] = new Point (20,21);
console.log(Point[sym])

console.log("-------- (4)");

// Inheritance but like actually
class InversePoint extends Point {
    constructor(x,y,inverse) {
        if (inverse) {
            super(y,x);
        } else {
            super(x,y);
        }
        this.inverse = inverse;
    }
}

let invPoint = new InversePoint(1,2,true);
console.log(String(invPoint));