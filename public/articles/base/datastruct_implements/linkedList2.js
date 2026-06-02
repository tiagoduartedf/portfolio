// insert
// o(1)

// interação
// time: o(n)
// space: o(n)

// base

class Node {
  constructor(value) {
    this.next = null;
    this.value = value;
  }
}

const a = new Node("a");
const b = new Node("b");
const c = new Node("c");
const d = new Node("d");
a.next = b;
b.next = c;
c.next = d;

// exercicio

function ArrayFromLinkedList(head) {
  const arrReturn = [];
  let current = head;
  while (current !== null) {
    arrReturn.push(current.value);
    current = current.next;
  }
  return arrReturn;
}
const arr = ArrayFromLinkedList(a);
console.log(arr);

// somas lista
const sa = new Node(1);
const sb = new Node(1);
const sc = new Node(1);
const sd = new Node(1);
sa.next = sb;
sb.next = sc;
sc.next = sd;

function sumList(head) {
  if (head == null) return 0;
  const x = sumList(head.next);
  console.log(x);
  const a = head.value + x;
  return a;
}
console.log(sumList(sa));

// reverse list

// zipper list
