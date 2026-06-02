/*
  pega um pivo e a partir dele ordena uma lista
  
  pega o primeiro como pivo (por convenção, podia ser outro)
  faz uma lista dos menores do pivo
  outra dos iguais
  outra dos maiores

  nessas listas ele chama o quicksort de novo, das listas criadas pelo pivo
  usando um novo pivot (primeiro elemento dessas listas geradas)

  e no final concatena tudo ordenado

  ordenação por recurssão (diferente dos 3)
*/

function quicksort(array) {
  if (array.length <= 1) return array;

  const pivot = array[0];

  const head = array.filter((n) => n < pivot);
  const equal = array.filter((n) => n === pivot);
  const tail = array.filter((n) => n > pivot);

  return quicksort(head).concat(equal).concat(quicksort(tail));
}

quicksort([4, 2, 1, 5, 3, 6]);

/*
exemplo de como funcionaria isso:

pivot -> 4
menor: quicksort([2, 1, 3]) {
  pivot -> 3
  menor: [2, 1] {
    pivot -> 2
    menor: [1]
    igual: [2]
    maior: []
  }
  igual: [3]
  maior: []
}
igual: [4]
maior: quicksort([5, 6]) {
  pivot -> 5
  menor: []
  igual: [5]
  maior: [6]
}

e no fim concatena tudo já ordenado


*/
