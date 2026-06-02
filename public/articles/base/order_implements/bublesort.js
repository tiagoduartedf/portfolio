/*
melhor caso: O(n), dados já estão ordenados
pior caso: O(n^2), todas as coparações possíveis são realizadas

então complexidade: O(n^2)
*/

/*
como funciona?
troca de um a um (um do lado do outro)
até o útlimo, achando o último ele faz tudo de novo pro penultimo e assim vai
*/

function bubbleSort(items) {
  let swap; // esse swap é, pq se percorreu e já tá ordenado nem faz nada
  let last = items.length - 1;
  do {
    swap = false;
    for (let i = 0; i < last; i++) {
      // maior que o do lado
      if (items[i] > items[i + 1]) {
        // passar valor pro lado
        [items[i], items[i + 1]] = [items[i + 1], items[i]]; // swap de vars por desestruturação
        swap = true;
      }
    }
    last--;
  } while (swap);
  return items;
}

const itemsTest = [1, 5, 6, 3, 2];
console.log(itemsTest);
const ordenedItems = bubbleSort(itemsTest);
console.log(ordenedItems);
