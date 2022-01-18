let car = {
    items: ["pocket lint",
        "approximately $2.21 in change",
    "broken phone charger"]
};

function thlam(isThlamed, toThlam) {
    if (toThlam == "car door") {
        car.items.push(isThlamed);
    }

    isThlamed = null;
    return isThlamed;
}

let penith = "my penith";
penith = thlam(penith, "car door");

console.log("Car items: " + car.items);
console.log("Penith state: " + penith);