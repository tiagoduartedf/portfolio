// impressões, fila de cinema

class FilaDePrioridade {
  constructor() {
    this.list = [];
  }
  // obs: (poderia fazer ao contrario: adicionar no inicio e remover no final)
  // adicionar no final da fila
  Enqueue(valueEntering, priorityEntering) {
    let added = false;
    for (let i = 0; i < this.list.length; i++) {
      if (priorityEntering > this.list[i][1]) {
        this.list.splice(i, 0, [valueEntering, priorityEntering]);
        added = true;
        break;
      }
    }
    if (!added) {
      this.list.push([valueEntering, priorityEntering]);
    }
    return [valueEntering, priorityEntering];
  }
  // remover do inicio da fila
  Dequeue() {
    return this.list.shift();
  }
  Front() {
    return this.list[0];
  }
  Size() {
    return this.list.length;
  }
  IsEmpty() {
    return this.list.length === 0;
  }

  // só pra consolar msm
  Print() {
    console.log(this.list);
  }
}

const filaMercado = new FilaDePrioridade();
filaMercado.Enqueue("Enzo", 1);
filaMercado.Enqueue("Valentina", 1);
filaMercado.Enqueue("Francisco", 3);
filaMercado.Enqueue("Aparecida", 3);
filaMercado.Enqueue("Lucas", 2);
filaMercado.Enqueue("Luis", 3);
filaMercado.Enqueue("Joacir", 3);
filaMercado.Enqueue("Thiago", 2);
filaMercado.Enqueue("Matheus", 2);
filaMercado.Enqueue("Lucia", 3);
filaMercado.Enqueue("Rita", 3);
console.log("---------------------");
filaMercado.Print();
console.log("---------------------");
filaMercado.Dequeue();
filaMercado.Dequeue();
filaMercado.Print();
