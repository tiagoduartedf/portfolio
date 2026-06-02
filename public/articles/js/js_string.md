# metodos de string

## trim, trimStart, trimEnd
remover espaços
```js
let str = "    texto    ";
console.log("[" + str + "]"); // 'texto'

const semEspaco = str.trim();
console.log("[" + semEspaco + "]"); // 'texto'

const semEspacoSoNoInicio = str.trimStart();
console.log("[" + semEspacoSoNoInicio + "]"); // 'texto    '

const semEspacoSoNoFinal = str.trimEnd();
console.log("[" + semEspacoSoNoFinal + "]"); // '    texto'
```


## slice
cortar de uma posição do vetor a outra
```js
const str = "0123456789"

const cincoPrimeiros = str.slice(0,5) // '01234'

const semPrimeiro = str.slice(1,str.length) // '123456789'
```

## replace
troca a primeira aparição de uma string por outra
```js
const str = "tchau tchau bom dia"
const semUmOi = str.replace("tchau", "oi") // 'oi tchau bom dia'
```

## replaceAll
troca todas as aparições de uma string por outra
```js
const str = "tchau tchau bom dia"
const semNenhumOi = str.replaceAll("tchau", "oi") // 'oi oi bom dia'
```

## split
criar array de string a partir de uma string
```js
// exemplo 1
const nomesString = "pedro, tiago, joao"
const nomesArrayString = nomesString.split(", ") // ['pedro', 'tiago', 'joao']
```

```js
// exemplo 2
const nomesString = "pedro*tiago*joao"
const nomesArrayString = nomesString.split("*") // ['pedro', 'tiago', 'joao']
```

## lastIndexOf
pesquisar pela ultima aparição de uma string dentro de uma string pra retornar seu indice
```js
const oiTresVezes = "oi oi oi"
const oiUltimaPos = oiTrezVezes.lastIndexOf("oi") // 6
// 6 pq a string oiTresVezes começa em 0 né
```
essa função é boa pra usar com o slice


## includes
retorna boolean se conter uma string
```js
const str = "tchau tchau bom dia"

str.includes("oi") // false
str.includes("tchau") // true
```
