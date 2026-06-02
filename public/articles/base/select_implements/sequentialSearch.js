// busca a posição de um valor num array sequencialmente
// passando por todos os valores de um a um até chegar no valor
// podendo ser usada em qualquer lista (ordenada ou não ordenada)

const vetor = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

function sequentialSearch(vetor, valueToSearch) {
  let totalPassadas = 0;
  for (let index = 0; index < vetor.length; index++) {
    const valorAtual = vetor[index];
    console.log(`passou mais uma vez [${index}]: ${valorAtual}`);
    totalPassadas++;
    if (valorAtual == valueToSearch) return index;
  }
  console.log("total passadas: ", totalPassadas);
  return -1;
}

console.log(sequentialSearch(vetor, 20));
console.log(sequentialSearch(vetor, 5));
