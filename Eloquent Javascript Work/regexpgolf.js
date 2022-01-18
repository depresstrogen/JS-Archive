let carcat = /ca(r|t)/;
console.log(JSON.stringify(carcat.exec("the ca and the cat")));
console.log(JSON.stringify(carcat.exec("carter")));

let popprop = /pr?op/;
console.log(JSON.stringify(popprop.exec("po pr porp pop pop")));

let ferretferryferarri = /ferr(et|y|ari)/;
console.log(JSON.stringify(ferretferryferarri.exec("fer ferre ferr ferar ferrari ferret")));

let iousend = /\wious/;
console.log(JSON.stringify(iousend.exec("pe ious fergilicious")));
