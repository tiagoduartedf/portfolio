// melhor caso O(n^2)
// pior caso O(n^2)

// como funciona?
// pegar o menor element e colocar na primeira posição
// na segunda o segundo menor, até acabar
// fazendo isso em cada interação

function selectionSort(vetor) {
  let menorPos;
  for (let i = 0; i < vetor.length - 1; i++) {
    // detectar o novo menor vetor no array
    menorPos = i;
    for (let j = i + 1; j < vetor.length; j++) {
      if (vetor[j] < vetor[menorPos]) {
        menorPos = j;
      }
    }
    // substituir a posição i atual pelo novo menor vetor
    if (i != menorPos) {
      [vetor[i], vetor[menorPos]] = [vetor[menorPos], vetor[i]]; // swap de vars por desestruturação
    }
  }
  return vetor;
}

const itemsTest = [1, 2, 6, 3, 5];
console.log(itemsTest);
const ordenedItems = selectionSort(itemsTest);
console.log(ordenedItems);
