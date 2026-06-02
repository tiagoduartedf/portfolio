// busca a posição de um valor num array, da seguinte forma:
// pega um meio e divide em dois espaços tentando achar o numero
// a partir do valor do meio ele decide se vai partir pra parte da direita ou pra parte da esquerda pra procurar o numero
// indo pra esquerda ou pra direita ele pega o meio dessa esquerda ou direita e repete todo proceso até achar o numero


// const vetor = [1,2,3,4,5];
//                l       r
//                l r

const vetor = [1,2,3,4,5,6,7,8,9,10,11,12,13];

let totalPassadas = 0;

function binarySearch(vetor, left, right, valueToSearch) {
	if(right >= left) {
		const indexMid = parseInt(left + (right-left)/2); // diferença do primeiro item pro ultimo dividido por 2
		const valorAtual = vetor[indexMid];
		console.log(`passou mais uma vez [${indexMid}]: ${valorAtual}`);
		totalPassadas++;
		if(valorAtual == valueToSearch) {
			console.log("total passadas: ", totalPassadas);
			return indexMid;
		}
		else if(valorAtual > valueToSearch) {
			return binarySearch(vetor, left, indexMid-1, valueToSearch);
		}
		else if(valorAtual < valueToSearch) {
			return binarySearch(vetor, indexMid+1, right, valueToSearch);
		}
	}
	console.log("total passadas: ", totalPassadas);
	return -1;
}

totalPassadas = 0;
console.log(binarySearch(vetor, 0, vetor.length-1, 20));

totalPassadas = 0;
console.log(binarySearch(vetor, 0, vetor.length-1, 5));

