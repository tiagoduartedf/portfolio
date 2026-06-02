class Node {
  constructor(el) {
    this.element = el;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.length = 0;
    this.head = null;
  }

  append(el) {
    let node = new Node(el);
    let current = new Node(null);
    if (this.head === null) {
      // primeiro da lista
      this.head = node;
    } else {
      current = this.head;
      while (current.next) {
        // percorre a lista até encontrar o ultimo item
        current = current.next;
      }
      // com o ultimo faz a ligação
      current.next = node;
    }
    this.length++;
  }
  insert(pos, el) {}
  removeAt(pos) {}
  remove(el) {}
  indexOf(el) {}
  isEmpty() {}
  size() {}
  toString() {
    let current = this.head;
    let str = "";
    while (current) {
      console.log(current);
      str += current.element + (current.next ? "," : ".");
      current = current.next;
    }
    return str;
  }
  print() {
    console.log(this.toString());
  }
}

let ll = new LinkedList();
let n1 = new Node("pedro");
let n2 = new Node("tiago");
let n3 = new Node("joao");
ll.append(n1);
ll.append(n2);
ll.append(n3);
ll.print();
