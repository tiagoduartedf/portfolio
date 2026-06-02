# o que é?
css com alguns poderes extras
como as funções que eu vou mostrar abaixo
que deixam o codigo css mais poderoso e mais facil de escrever e ler

diferente do que eu costumo fazer o SASS usa um arquivo externo de css
(nada impede de ser usado em conjunto com css-in-js)

mas existem vantagens de usar CSS externo e css in js:

## vantagens CSS-IN-JS / CSS-EXTERNO

css externos: {
	- separados e importados conforme necessidade
	
	- separação de estilo e conteudo (qnd vc ta lendo o componente, n precisa entender o estilo, que ta externo, o codigo fica menor)
	
	- mais facil de ser reutilizado em varios outros componentes
}

em comparação ao css-in-js que eu to acostumado
css-in-js: {
	escopo do componente separado como eu faço, fica mais fácil de entender o estilo e 
	
	prevenção de vazamento de estilo
	
	integração direta com a logica do projeto
	
	capacidade de usar lógica JavaScript para estilizar componentes dinamicamente e a capacidade de aproveitar recursos como props e contextos para estilização condicional.
	
	capacidade de usar 
}

# rodando transpilação
os arquivos .SCSS são transpilados pra .CSS normal com o sass

comando pra transspilar:
sass --watch ./assets/scss/style.scss:./assets/css/style.css

pra instalar (eu acho)
npm install --global sass


# funções SASS


## nests

é como o css deveria ser kkk

```SCSS
colocar um dentro do outro
p {
	span {
		background: red;
	}
	b {
		background: black;
	}
	&:hover {
		color: #FFF;
	}
}
```

no css normal fica:
```CSS
p span {
	background: red;
}

p b {
	background: black;
}
p: hover {
	color: #FFF;
}
```

## herança
```
.btn {
	width: 200px;
	padding: 10px 0;
	background: none;
	border: 0;
	border-radius: 10px;
}

.btn-laranja {
	@extend .btn
	background: orange;
}
```

no css normal fica:
```
.btn, .btn-laranja {
	width: 200px;
	padding: 10px 0;
	background: none;
	border: 0;
	border-radius: 10px;
}

.btn-laranja {
	background: orange;
}
```

e no html não precisaria mais ser
`<button class="btn btn-laranja" />`

pode ser só
`<button class="btn-laranja" />`

## import
```style.scss
@import "./button.scss";

p{
	color: orange;
}
```
com:
```button.scss
.btn {
	width: 200px;
	padding: 10px 0;
	background: none;
	border: 0;
	border-radius: 10px;
}

.btn-laranja {
	@extend .btn
	background: orange;
}
```

## variavel
```
$color-orange: orange;

p{
	$color-orange: $color-orange;
}
```

no css normal fica:
```
p {
	color: orange;
}
```

## mixin

OBS: não usar mixin pra tudo pq ele repete o codigo, então usar em conjunto com nest por exemplo

```
<button class="btn btn-laranja">
Button
</button>


<button class="btn btn-roxo">
Button
</button>

<button class="btn btn-amarelo">
Button
</button>
```

fazer varios elementos com cores diferentes, mas usar dos msm atributos?
por exemplo, precisando fazer?
```
.btn {
	width: 200px
	padding: 10px 0p;
	background: none;
	border: 0;
	boder-radius: 10px;
	display: block;
	margin: 10px 0;
}

.btn-laranja {
	@extend .btn;
	background: orange;
	color: white;
}
btn-roxo {
	@extend .btn;
	background: purple;
	color: white;
}
btn-amarelo {
	@extend .btn;
	background: yellow;
	color: black;
}
```

faça com mixin, assim:

```scss
.btn {
	width: 200px
	padding: 10px 0p;
	background: none;
	border: 0;
	boder-radius: 10px;
	display: block;
	margin: 10px 0;
	
	&.btn-laranja {
		@include button-style(orange, white);
	}
	&.btn-roxo {
		@include button-style(purple, white);
	}
	&.btn-amarelo {
		@include button-style(yellow, black);
	}
}
```

no css
```css
.btn {
	width: 200px
	padding: 10px 0p;
	background: none;
	border: 0;
	boder-radius: 10px;
	display: block;
	margin: 10px 0;
}
.btn.btn-laranja {
	background: orange;
	color: white;
}
.btn.btn-roxo {
	background: purple;
	color: white;
}
.btn.btn-amarelo {
	background: yellow;
	color: black;
}
```


## funções

criar é mais avançado, tem já prontas


### darken, desaturate, mix
background: darken($background, 5%);
background: desaturate($background, 5%);
background: mix($background, blue);
background: grayscale($background);
```scss
@mixin button-style($background, $color) {
	background: $background;
	color: $color;
	&:hover {
		background: darken($background, 5%);
	}
}

.btn {
	width: 200px
	padding: 10px 0p;
	background: none;
	border: 0;
	boder-radius: 10px;
	display: block;
	margin: 10px 0;
	&.btn-laranja {
		@include button-style(orange, white);
	}
	&.btn-roxo {
		@include button-style(purple, white);
	}
	&.btn-amarelo {
		@include button-style(yellow, black);
	}
}
```

## minify

pegar todo o codigo de css que esta em varias linhas e transformar em uma só

`Sass (endereço arquivo SCSS) : (endereço arquivo CSS)  -- style compressed`

ai um arquivo como esse:
```css
.btn {
	width: 200px
	padding: 10px 0p;
	background: none;
	border: 0;
	boder-radius: 10px;
	display: block;
	margin: 10px 0;
}
.btn.btn-laranja {
	background: orange;
	color: white;
}
.btn.btn-roxo {
	background: purple;
	color: white;
}
.btn.btn-amarelo {
	background: yellow;
	color: black;
}
```

ficaria assim:
```
.btn{width:200px;padding:10px 0p;background:none;border:0;boder-radius:10px;display:block;margin:10px 0}.btn.btn-laranja{background:orange;color:white}.btn.btn-roxo{background:purple;color:white}.btn.btn-amarelo{background:yellow;color:black}
```
