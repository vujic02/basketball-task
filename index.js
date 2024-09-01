const { simulirajGrupnuFazu } = require("./grupnaFaza.js");
const { kreirajZreb } = require("./eliminacionaFaza.js");

console.log("Simulacija Košarkaškog turnira... ");
const rangiraniTimovi = simulirajGrupnuFazu();
kreirajZreb(rangiraniTimovi);
console.log("Simulacija završena!");
