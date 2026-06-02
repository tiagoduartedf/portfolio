const SerieA = new Set();
SerieA.add("flamengo");
SerieA.add("flamengo");
SerieA.add("fluminense");
SerieA.delete("fluminense");
SerieA.add("botafogo");
SerieA.add("corinthias");
SerieA.add("palmeiras");
SerieA.add("sao paulo");
SerieA.add("santos");

console.log("serie A: " + Array.from(SerieA.values())); // times acima (sem repetir)

const SerieB = new Set();
SerieB.add("vasco");
SerieB.add("fluminense");
SerieB.add("botafogo");
SerieB.add("santos");

console.log("serie B: " + Array.from(SerieB.values()));

const Paulista = new Set();

Paulista.add("corinthias");
Paulista.add("palmeiras");
Paulista.add("sao paulo");
Paulista.add("santos");

console.log("times paulistas (forEach):");
Paulista.forEach((el) => {
  console.log(el);
});
console.log("------");
