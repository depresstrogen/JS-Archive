class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(" + this.x + ", " + this.y + ")";
    }

    get length() {
        let len = Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
        return len;
    }
}

Vector.prototype.plus = function(vec2) {
    return new Vector(this.x + vec2.x, this.y + vec2.y);
}

Vector.prototype.minus = function(vec2) {
    return new Vector(this.x - vec2.x, this.y - vec2.y);
}


vec1 = new Vector(20, 25);
vec2 = new Vector(6, 9);
vec3 = new Vector(1,1);

console.log(String(vec1));
console.log(String(vec1.plus(vec2)));
console.log(String(vec2.minus(vec1)));
console.log(vec3.length);