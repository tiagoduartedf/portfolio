class OurSet {
  constructor() {
    this.collection = [];
  }

  // retorna os valores do set
  Values() {
    return this.collection;
  }

  // checa se o valor existe no set, percorrendo ele todo
  Has(value) {
    return this.Values().indexOf(value) != -1;
  }

  // adiciona se não existir
  Add(newValue) {
    if (!this.Has(newValue)) {
      this.Values().push(newValue);
      return true;
    } else {
      return false;
    }
  }

  // remove pelo value
  Remove(removeValue) {
    const valueIndex = this.Values().indexOf(removeValue);
    if (valueIndex != -1) {
      this.Values().splice(valueIndex, 1);
      return true;
    } else {
      return false;
    }
  }

  // pega o tamanho dos valores do set
  Size() {
    return this.Values().length;
  }

  // a partir daqui, não existe no Set nativo do js

  // une o valor de 2 sets
  Union(otherSet) {
    const unifiedSet = new OurSet();
    this.Values().forEach((el) => {
      unifiedSet.Add(el);
    });
    otherSet.collection.forEach((el) => {
      unifiedSet.Add(el);
    });

    return unifiedSet;
  }

  // pega a interseção dos 2
  Intersection(otherSet) {
    const intersectionSet = new OurSet();
    // pega o menor e o maior pra fazer o loop no menor
    const smallerToBiggerSet =
      this.Size() < otherSet.Size() ? [this, otherSet] : [otherSet, this];

    smallerToBiggerSet[0].collection.forEach((el) => {
      if (smallerToBiggerSet[1].Has(el)) intersectionSet.Add(el);
    });
    return intersectionSet;
  }

  // pega a diferença dos 2
  Difference(otherSet) {
    const DifferenceSet = new OurSet();
    this.Values().forEach((el) => {
      if (!otherSet.Has(el)) {
        DifferenceSet.Add(el);
      }
    });

    otherSet.Values().forEach((el) => {
      if (!this.Has(el)) {
        DifferenceSet.Add(el);
      }
    });

    return DifferenceSet;
  }

  // checa se um ta dentro do outro
  Subset(otherSet) {
    return this.Values().every((el) => otherSet.Has(el));
  }
}

const SerieA = new OurSet();
SerieA.Add("flamengo");
SerieA.Add("flamengo");
SerieA.Add("fluminense");
SerieA.Remove("fluminense");
SerieA.Add("botafogo");
SerieA.Add("corinthias");
SerieA.Add("palmeiras");
SerieA.Add("sao paulo");
SerieA.Add("santos");

console.log("serie A: " + SerieA.Values()); // times acima (sem repetir)

const SerieB = new OurSet();
SerieB.Add("vasco");
SerieB.Add("fluminense");
SerieB.Add("botafogo");
SerieB.Add("santos");

console.log("serie B: " + SerieB.Values());

const Paulista = new OurSet();

Paulista.Add("corinthias");
Paulista.Add("palmeiras");
Paulista.Add("sao paulo");
Paulista.Add("santos");

// a partir daqui, não existe no Set nativo do js
console.log(SerieA.Union(SerieB).Values()); // todos os times
console.log(SerieA.Intersection(SerieB).Values()); // botafogo e santos
console.log(SerieA.Difference(SerieB).Values()); // sem o botafogo e o santos

console.log(Paulista.Subset(SerieA)); // true
console.log(Paulista.Subset(SerieB)); // false
