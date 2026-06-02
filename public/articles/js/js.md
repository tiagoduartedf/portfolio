tudo que eu gostaria de saber de js antes de estudar react,node e começar meus projetos

blz, começar criando apps, sem base é mais empolgante e talvez faça mais gente hypar na área, mas se vc quer ser profissional vc tem q ter uma boa base
pq mts vezes vc ta preso num problema por ter pulado etapas, não consegue se virar sozinho pq pulou etapas
qualquer coisa avançada é simples se vc tem os fundamentos

# metodos para trabalhar com a linguagem

## prototype
sistema de herança do javascript (tudo no js é objeto)
um array é um objeto que herda metodos da classe array
(mostrar no chrome declarando objeto e dando console.log)

por isso o array tem alocação dinamica, push,pop dentre outros metodos


como tudo é objeto, pra trabalhar bem com a linguagem é legal conhecer os metodos de cada objeto:

## metodos dos tipos de dados

- [Arrays e seus métodos](./js_array.md)

- [Strings e seus métodos](./js_string.md)

- [Objetos e seus métodos](./js_object.md)


## variaveis

### diferença de let,var,const

#### let
- tem escopo de bloco
- não pode ser redeclarado
#### const
- tem escopo de bloco
- não pode ser redeclarado
- não pode ser reatribuido
#### var
variaveis criadas com var podem ser redeclaradas dentro de outro escopo
um loop pode deixar vestigios de variaveis que podem criar bugs doidos
```
var str = "oi"
function retornaStr() {
	str = "tchau";
	return str;
}
console.log(str); // tchau, pq ali embaixo ele ta fazendo um
var str = "tchau", mudando a variavel de cima, com let nao da pra fazer isso
```
nunca usar o var

## diferença de null pra undefined
null = valor definido como vazio
undefined = var x;

## funções

### diferença: function declartion, function expression
```js
function declaration() {
	return 1;
}

const expression = function() {
	return 1;
}
```
expression só pode ser usada dps de declarar, declaration pode ser usada antes
```js
declaration(); // 1
expression(); // ERROR
function declaration() {
	return 1;
}

const expression = function()() {
	return 1;
}
declaration(); // 1
expression(); // 1
```

### comparações

# falsy table

## comparação simples de um valor (if VAR)
false:
undefined, null, false, 0, ""

true:
todo o resto

## comparações com == de tipos diferentes dois valores (if VAR1 == VAR2)
- null == undefined // true
- undefined == null // true
- number == string // n == toNumber(s)
- string == number // toNumber(s) == n
- boolean == any // toNumber(b) == a
- any == boolean // a == toNumber(b)
- string||number == object // sn == toPrimitive(o)
- object == string||number // toPrimitive(o) == sn

# user ?? ao invés de ||

pq || retorna 0 como false

```js
const a = 0;
console.log(a ?? "nao definido ou nulo, podendo ser 0")
```

### outros

#### esmodules
`import Principal, { Secundaria1, Secundaria2 } from "./a";`

```js
export default function Principal() {
	console.log("oie");
}
export function Secundaria1() {
	console.log("oie");
}
export function Secundaria2() {
	console.log("oie");
}
```

renomear
`import { a as nicknameA } from "./a";`
`nicknameA()`
```
export function a() {
	console.log("oie");
}
```

export proxy
b.js
`import { a } from "./b";`
`a()`
```
export { a } from "./a"
```




### template literals (lidando com strings)
```js
const name = "Teste";
const welcome = "Bem vindo, " + name
```

igual
```js
const name = "Teste"
const welcome = `Bem vindo, ${name}`
```

e tbm da pra dar umas brincadas
```js
const name = null
const welcome = `Bem vindo, ${name ?? "visitante"} 
```




### vanilla
selectors {
	getElementById
	getElementByClass
}
event listeners {
	element.addEventListener("mouseover", myFunction);
	element.addEventListener("click", mySecondFunction);
	element.addEventListener("mouseout", myThirdFunction);
}



### lidar com erros
as vezes você vai bater numa api que pode responder ou pode retornar um erro, aí vc usa o try,catch

#### try
se der tudo certo, executar x
#### catch
se der erro, o que fazer com o erro que vai receber por parametro
#### finally
o que acontece depois de executar tanto o try quanto o catch, normalmente usado pra fechar telas de carregamento e coisas do tipo

#### throw
throw é no backend que envia o erro pra receber dentro do catch que a outra app vai usar
```
if (error)
  throw new Exception('Error VISH');
```

#### criar erros personalizados:
todo



### funções

# função de callback
permite executar uma função dps de uma determinada ação
é basicamente, passar uma função por parametro de outra função e executar ela no código

```js
function exibir(num) {
  console.log("A operação resultou em: " + num);
}

function soma(a, b, callback) {
  var op = a + b;
  callback(op);
}

function multiplicacao(a, b, cb) {
  var op = a * b;
  cb(op);
}

soma(2, 2, exibir);

multiplicacao(2, 4, exibir);
```
/\ esse foi um exemplo de callback sincrona
setTimeout e setInterval implementam callback functions de forma assincrona, diferente do exemplo acima de callback sincronas (pre-Promise)



# promises

função assincrona que roda no final da fila de eventos normais do javascript

then é se deu certo
catch é se deu erro
finally é independente se deu certo ou errado (no final dela executar, pra tirar um load da tela ou algo assim)

```js
fetch("https://api.github.com/users/aszarth")
	.then(response => {
		return response.json();
	})
	.then(body => {
		console.log(body)
	})
	.catch(err => {
		console.log(err)
	})
	.finally(() => {
		console.log("cabo")
		// parar tela de carregamento, por exemplo
	})
```


```js
async function buscaDadosGithub() {
	try {
		const response = await fetch("https://api.github.com/users/aszarth");
		const body = await response.json();
		
		return body.name;
	}
	catch(err) {
		console.log(err)
	}
	finally {
		console.log("deu")
	}
}

buscaDadosGithub().then(name => {
	console.log(name)
});
```

roda no final da fila do javascript então, esse código:
```
new Promise((resolve) => {
	console.log(1);
	resolve(2);
}.then(result => console.log(result))
console.log(3);
```

deve printar:
`1, 3, 2`

pq a promise vai pra microtask queue
que executa no final da fila de eventos normais




# por que usar map,forEach (promise)
- usar as funções de loop do javascript (forEach, map...) ajudam porque elas ficam parecidas Promise.all()
(executando tudo no final)



# diferença promise / await

await = syntax sugar de Promise.then

await joga tudo de baixo pra dentro de um .then
ficando um .then dentro do outro se tiver varios juntos

```js
(async () => {
const axios = require('axios')
const gitHubApi = user => `https://api.github.com/users/${user}/repos`

console.time()
const p1 = await axios.get(gitHubApi('aszarth'))
const p2 = await axios.get(gitHubApi('aszarth'))
const p3 = await axios.get(gitHubApi('aszarth'))
// console.log(res1.status, res2.status, res3.status)
console.timeEnd()

})()
```
mesma coisa de 
```js
p1.then(e => [
p2.then
```

diferente de guardar todas as promises em variaveis e no final dar um Promise.all([p1,p2,p3])
exemplo:
```js
(async () => {
const axios = require('axios')
const gitHubApi = user => `https://api.github.com/users/${user}/repos`

console.time()
const p1 = axios.get(gitHubApi('aszarth'))
const p2 = axios.get(gitHubApi('aszarth'))
const p3 = axios.get(gitHubApi('aszarth'))
await Promise.all([p1,p2,p3])
console.timeEnd()

})()
```
(ideal fazer assim quando uma requisição não depende da outra, de cima)


# por que/quando não usar map,forEach / promise.all (promise)
se vc precisa que uma requisição dependa da outra, vc vai colocar um .then dentro de outro .then, usando o await
porque assim como promise.all, no fim do primeiro loop do event loop ele vai executar tudo, se um await depende do dado do await de cima não usar forEach, usar for normal ou for of, pq dai fica um then dentro do outro
