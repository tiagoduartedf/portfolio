// como funciona?
// pega um item de um array
// e coloca em um novo já ordenando
// de tras pra frente pq esse novo array ja ta pre ordenado antes desse item novo

// simula um cenario de pegar uma carta do morto
// e ir inserindo no grupo de cartas q vc já tem ordenado na mão

// complexidade:
// o melhor caso seria linear (Complexidade N, N = Tamanho do vetor, quando o vetor já se encontra ordenado)
// já nos seus médio se aproxima do pior caso que é N², sendo o pior caso, quando está ordenado de forma inversa.

function insertionSort(vetor) {
  let atual;
  // vai do segundo ate o final
  for (let i = 1; i < vetor.length; i++) {
    let j = i - 1; // posição até onde já tem tudo ordenado
    atual = vetor[i];
    // enquanto ainda tem uma pos pra ir pra esquerda
    while (j >= 0 && atual < vetor[j]) {
      vetor[j + 1] = vetor[j];
      j--;
    }
    // encontrou a posição da carta que é menor que essa que eu to tentando inserir
    vetor[j + 1] = atual;
  }
  return vetor;
}

const itemsTest = [1, 2, 6, 3, 5];
console.log(itemsTest);
const ordenedItems = insertionSort(itemsTest);
console.log(ordenedItems);
