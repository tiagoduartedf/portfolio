# metodos de array []

os mais importantes:
map,filter,every,some,find,findIndex,reduce
`const arr = [1,2,3,4,5];`







## push, pop, unshift, shift

## pop
remove no final do array
`arr.pop();`
// [1, 2, 3, 4]

## push
adiciona ao final do array
`arr.push(5)`
`arr.push(6)`
// [1, 2, 3, 4, 5, 6]

## unshift
adiciona ao inicio do array
`arr.unshift(0);`
`arr.unshift(-1);`
// [-1, 0, 1, 2, 3, 4, 5, 6]

## shift
remove ao inicio do array
`arr.shift();`
tira o -1
// [0, 1, 2, 3, 4, 5, 6]

## sort, reverse
const arrSR = [1,4,3,5,6,1,0]
- `arrSR.sort()` // [0, 1, 1, 3, 4, 5, 6]
- `arrSR` // [0, 1, 1, 3, 4, 5, 6]
- `arrSR.reverse()` // [6, 5, 4, 3, 1, 1, 0]
- `arrSR` // [6, 5, 4, 3, 1, 1, 0]

ordenando array de objetos
```js
const items = [
  { name: 'Edward', age: 21 },
  { name: 'Sharpe', age: 37 },
  { name: 'And', age: 45 },
  { name: 'The', age: -12 },
  { name: 'Magnetic', age: 13 },
  { name: 'Zeros', age: 37 }
];
items.sort((a, b) => a.age - b.age);
```



## find
percorre o array do começo ao fim (0-lenght)
e retorna o primeiro item que satisfaz a condição
se n tiver retorna undefined
```js
const arr = [1,2,3,4];
const temDois = arr.find(item => item % 2 === 0);
// 2
```

## findIndex
msm coisa que o find, só que retorna o indice do array
```js
const par = arr.findIndex(item => item % 2 === 0);
// retorna 1, pq o primeiro item q satisfaz a condição é 2
// se n tiver retorna -1
```


# splice

### removendo a partir de posições
```js
const arrToSplice = [1,4,3,5,6,11,0];
arrToSplice.splice(5,3); // [11, 0]
```
apartir da posição 5, removerá 3 valores
retornando: [1, 0]

### removendo um elemento especifico (exemplo de uso recorrente)
```js
const arrToSplice = [1,4,3,5,6,11,0];
const index = arrToSplice.indexOf(11);
if (index !== -1) {
  arrToSplice.splice(index, 1); // [1,4,3,5,6,0];
}
```









## for in, for of, forEach
`arrToLoop = [2,4,8,16,32];`
### forEach
percorre a lista inteira sem retornar nada
```js
arr.forEach((elemento, indice) => {
    console.log(`[${indice}] ${elemento}`);
})
```

```js
/*
[0] 2
[1] 4
[2] 8
[3] 16
[4] 32
*/
```

### for of
mesma coisa que o forEach com outra sintaxe e sem as tratativas
```js
for(elemento of arr) {
    console.log(elemento)
}
```

```js
/*
2
4
8
16
32
*/
```


### for in
parecido com o for of, mas retornando as posições
```js
for(indice in arr) {
    console.log(indice)
}
```

```js
/*
0
1
2
3
4
*/
```

## map
percorre o array todo (como forEach), mas/e retornando um novo array
do msm tamanho que o original
```js
const novoArray = arr.map((elemento, indice) => {
	if(elemento % 2 === 0) {
		return elemento * 10;
	}
	return elemento;
})
```

## filter
percorre o array (sem alterar o array) pegando/retornando um pedaço/parte do array filtrado

exemplo, filtrar só os itens carros:
```js
const arrToFilter = ["pera", "uva", "maça", "carro", "carro"]
arrToFilter.filter((element) => element == "carro"); // ['carro', 'carro']
```

exemplo, filtrar numeros pares
```js
const arr = [1,2,3,4,5,6,7,8,9,10];
const novoArrayPares = arr.filter(item => item % 2 === 0) // [2, 4, 6, 8, 10]
```

da pra usar 2 metodos juntos tipo
apartir de um filter, percorrer o novo array inteiro multiplicando por 10
```js
// pegar todos os impares, muplicar por 10 e retornar
const arr = [1,2,3,4,5,6,7,8,9,10];
const novoArray = arr
.filter(item => item % 2 !== 0)
.map(item => item * 10)
// novoArray -> [10, 30, 50, 70, 90]
```

outro exemplo de filter, remover carros:
```js
// remover os elementos carros
const arrFrutas = ["pera", "uva", "maça", "carro", "carro"]
let frutasSemCarro = arrFrutas.filter((item) => {
     if(item !== "carro") return item;                       
})
console.log(frutasSemCarro); // ["pera", "uva", "maça"]
```

## every
retorna um booleano true ou false
caso TODOS os itens satisfazem a uma condição
```js
const arrMix = [1,2,3,"quatro"];
const arrNums = [1,2,3,4];
const todosItensSaoNumeros1 = arrMix.every(item => typeof item === "number"); // false
const todosItensSaoNumeros2 = arrNums.every(item => typeof item === "number"); // true
```

## some
retorna true ou false
verifica se pelo menos UM item satisfaz a uma condição
```js
const arrMix = [1,2,3,"quatro"];
const arrNums = [1,2,3,4];
const peloMenosUmItemEString1 = arrMix.some(item => typeof item === "string"); // true
const peloMenosUmItemEString2 = arrNums.some(item => typeof item === "string"); // false
```

## reduce
pegar um array e criar uma nova estrutura de dados baseada nesse array (reduz o array a algo)
sem muita regra, da pra fazer quase tudo
```js
const array = [1,2,3,4,5];
const valorIncial = 10; // não precisa ser variavel, coloquei só pra nomear e ficar mais facil
const soma = array.reduce((acc, item) => {
	console.log(`acc: ${acc} item: ${item}`);
	return acc + item
}, valorIncial)
console.log(soma);
```

# desestruturação (ARRAY)

exemplo de pegar os dois primeiros valores de um array

sem desestruturação:
```js
const array = [0,1,2,3,4,5]
const first = array[0];
const second = array[1];
```

com desestruturação:
```js
const array = [0,1,2,3,4,5]
const [first, second] = array;
```
(usado no useState por exemplo)

# desestruturação + rest operator (ARRAY)

```js
const array = [0,1,2,3,4,5]
const [first, second, ...restoArray] = array;
first // 0
second // 1
restoArray // [2, 3, 4, 5]
```


