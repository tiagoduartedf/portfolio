# objetos {}

```js
user = {
	name: "test",
	nickname: "definido",
	idade: 27,
	adress: {
		street: "av test",
		number: "171"
	}
}
```

## metodos

### Object.in
`console.log('name' in user);` // true

`console.log('lastName' in user);` // false

### Object.keys
`console.log(Object.keys(user));` // ['name', 'nickname', 'idade', 'adress']

### Object.values
`console.log(Object.values(user));` // ['test', 'definido', 27, {…}]

### Object.entries
`console.log(Object.entries(user));`
// retorno:
```js
0: (2) ['name', 'test']
1: (2) ['nickname', 'definido']
2: (2) ['idade', 27]
3: (2) ['adress', {…}]
length: 4
[[Prototype]]: Array(0)
```

## desestruturação (OBJECT)
```js
const adress = user.adress;
const idade = user.idade;
```

msm coisa de
```js
const { adress, idade } = user
```

e da pra renomear tipo
```js
const { adress, idade: age } = user
console.log(age)
```

da tbm pra setar um valor default
```js
const { adress, idade, nickname = "semnick" } = user;
```

## rest operator + desestruturação (OBJECT)

se eu quiser pegar só o nome, como fica o resto? adress,idade,nickname?
da pra eu pegar esses valores com o rest (...)

```js
const { name, idade, ...resto } = user;
```

* rest operator tbm pode ser usado em arrays *




## short sintaxy

const name = "test"
const age = 27

```js
const user = {
	name: name,
	age: age,
}
```

é a msm coisa que
```js
const user = {
	name,
	age,
}
```

## optinal chaining

pra lidar com propriedades de objetos que podem não existir
sem retornar erro

```js
console.log(
	user.adress
		? user.adress.zip
			? user.adress.zip.code
				: "Não informado"
		: "Não informado"
)
```

é a msm coisa que

```js
console.log(user.adress?.zip?.code ?? "Não informado")
```

funciona até pra função
`user.adress?.showFullAdress?.()`

basicamente ele tenta acessar dps do ?. e se não tiver ele para e desiste sem erro
