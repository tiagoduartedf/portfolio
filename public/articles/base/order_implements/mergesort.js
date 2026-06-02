/*
  ordenação por recurssão (diferente dos 3)
  ordenação por mistura / intercalação

  dividir pra conquistar
*/

// complexidade:
// melhor caso O(n log n)
// pior caso O(n log n)

// como funciona?
/*
divide em varias partes

3 passos:
1) 1 dividir o problema em problemas menores, recursivamente, dividno até q ele fique pequeno o bastante pra resolver (2x2)
2) resolver os problemas menores
3) combinação desses problemas menores resolvidos/ordenados até juntar tudo

// - curiosidade: JS usa TINSORT, que á uma variação do merge sort
*/

function mergeSort(vetor, inicio, fim) {
  // vai dividir até virar unidade, não é unidade:
  if (inicio < fim) {
    let meio = Math.floor((inicio + fim) / 2);
    mergeSort(vetor, inicio, meio);
    mergeSort(vetor, meio + 1, fim);
    return intercalar(vetor, inicio, meio, fim);
  }
}

// intercalar é quem de fato faz a ordenação dos elementos
// pega uma parte a esquerda e uma a direita e ordena
function intercalar(vetor, inicio, meio, fim) {
  let tamanho_vetor_a_ordenar = fim - inicio + 1;
  // esquerdo,direito incrimentador
  // pra a gente saber se ainda tem elemento do lado esquerdo ou direito
  // pra a gente comparar com o vetor do outro lado
  esquerdo = inicio;
  direito = meio + 1;
  // console.log(`intercalar ${inicio} ${fim}`);
  // ver se ja chegou no meio (esquerdo) ou fim (direito)
  let fim_esquerdo = false,
    fim_direito = false;
  // novo vetor ordenado
  let ordenado = [];

  for (let i = 0; i < tamanho_vetor_a_ordenar; i++) {
    // tem pra percorrer dos dois lados?
    if (!fim_esquerdo && !fim_direito) {
      if (vetor[esquerdo] < vetor[direito]) {
        ordenado[i] = vetor[esquerdo++];
      } else {
        ordenado[i] = vetor[direito++];
      }
      if (esquerdo > meio) fim_esquerdo = true;
      if (direito > fim) fim_direito = true;
    }
    // qnd só tiver pra percorrer de um lado, só vai ter itens de um lado
    else {
      if (!fim_esquerdo) {
        ordenado[i] = vetor[esquerdo++];
      } else if (!fim_direito) {
        ordenado[i] = vetor[direito++];
      }
    }
  }

  return ordenado;
}

const itemsTest = [1, 2, 6, 3, 5];
console.log(itemsTest);
const ordenedItems = mergeSort(itemsTest, 0, itemsTest.length - 1);
console.log(ordenedItems);
