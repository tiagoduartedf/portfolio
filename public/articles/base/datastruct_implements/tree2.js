class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }

  print() {
    console.log(this.root);
  }

  insert(value) {
    const newNode = new Node(value);
    // arvore vazia
    if (!this.root) {
      this.root = newNode;
    }
    // ja populada
    else {
      let point = this.root;
      while (point) {
        // descendo pra esquerda
        if (value < point.value) {
          // vazio = achou posição pra colocar
          if (!point.left) {
            point.left = newNode;
            break;
          }
          // apontar pro proximo a esquerda
          else {
            point = point.left;
          }
        }
        // descendo pra direita
        else if (value > point.value) {
          // vazio = achou posição pra colocar
          if (!point.right) {
            point.right = newNode;
            break;
          }
          // apontar pro proximo a direita
          else {
            point = point.right;
          }
        }
        // numero repitido, string que não da pra comparar...
        else {
          throw new Error("numero repitido, string que não da pra comparar...");
        }
      }
    }
  }
}

const t = new BST();
t.insert(10);
t.insert(11);
t.insert(9);
t.insert(8);
t.print();
