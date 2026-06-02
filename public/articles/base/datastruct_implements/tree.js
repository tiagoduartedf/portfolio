/*
arvore
lista ligada, que no geral é mais barato de inserir e procurar pq divide na metade
e se tiver balanceada isso da uma diferença enorme
se não tiver nada balanceada é como uma lista encadeada


arvore n custa mt espaço adicionao pra ordenar e custa literalmente
O logaritimo, tudo bem q é pra cada elemento
mas a complexidade é uma ordem de grandeza mais rapida
que qualquer ordenação de array (merge sort...)



pesquisa melhor q array, linked list e hash table
*/

// dom do js é uma arvore (pode ter qnts filhos quiser, mas só pode ter 1 pai)
// claro q não é uma arvore binaria

// bst
// busca O(log n)
const arvore = {};

function insert(tree, value) {
  // tem valor vai descendo
  if (tree.value) {
    if (value > tree.value) {
      insert(tree.right, value);
    } else {
      insert(tree.left, value);
    }
  }
  // vazia
  else {
    tree.value = value;
    tree.right = {};
    tree.left = {};
  }
}

// automaticamente balanceada (ao adicionar) (insersão mais cara)
function insertResposive(tree, value) {}

function remove(tree, element) {}

function rebalanceTree(tree) {}

insert(arvore, 10);
console.log(arvore);
insert(arvore, 11);
console.log(arvore);
insert(arvore, 9);
console.log(arvore);
insert(arvore, 8);
console.log(arvore);
