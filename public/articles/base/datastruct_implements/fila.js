// impressões, fila de cinema

class Fila {
  constructor() {
    this.values = [];
  }
  // obs: (poderia fazer ao contrario: adicionar no inicio e remover no final)
  // adicionar no final da fila
  Enqueue(value) {
    return this.values.push(value);
  }
  // remover do inicio da fila
  Dequeue() {
    return this.values.shift();
  }
  Front() {
    return this.values[0];
  }
  Size() {
    return this.values.length;
  }
  IsEmpty() {
    return this.values.length === 0;
  }
}

const filaCinema = new Fila();
console.log(filaCinema.IsEmpty()); // true
console.log(filaCinema.Size()); // 0
console.log(filaCinema.Front()); // undefined
console.log("---------------------");
filaCinema.Enqueue("Pedro");
filaCinema.Enqueue("Tiago");
filaCinema.Enqueue("Joao");
console.log(filaCinema.IsEmpty()); // false
console.log(filaCinema.Size()); // 3
console.log(filaCinema.Front()); // Pedro
console.log("---------------------");
filaCinema.Dequeue();
console.log(filaCinema.IsEmpty()); // false
console.log(filaCinema.Size()); // 2
console.log(filaCinema.Front()); // Tiago
console.log("---------------------");
filaCinema.Dequeue();
console.log(filaCinema.IsEmpty()); // false
console.log(filaCinema.Size()); // 1
console.log(filaCinema.Front()); // Joao
console.log("---------------------");
filaCinema.Dequeue();
console.log(filaCinema.IsEmpty()); // true
console.log(filaCinema.Size()); // 0
console.log(filaCinema.Front()); // undefined
console.log("---------------------");
