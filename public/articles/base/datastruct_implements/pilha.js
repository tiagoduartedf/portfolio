// last in first out

// como uma pilha de prata, livros
// ultimo a colocar primeiro a sair
// proximo a colocar entra no topo

class Pilha {
  constructor() {
    this.list = {};
    this.count = 0;
  }
  Length() {
    return this.count;
  }
  Peek() {
    return this.list[this.count - 1];
  }
  // tirar do final
  Pop() {
    if (this.count == 0) {
      return undefined;
    }
    this.count--;
    let auxPop = this.list[this.count];
    delete this.list[this.count];
    return auxPop;
  }
  // adicionar ao final
  Push(value) {
    this.list[this.count] = value;
    this.count++;
  }
}

const test = new Pilha();
test.Push(1);
console.log(test.Peek());
test.Push(2);
console.log(test.Peek());
console.log(test.Pop());
console.log(test.Peek());
