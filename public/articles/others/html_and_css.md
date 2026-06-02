*to-do: criar resumo de HTML,CSS pro igor*



# Tags semanticas em relação ao React Native:

No HTML existem diversas TAGs pra fazer "a mesma coisa", mas elas tem semantica diferentes e devem ser usadas diferentes pra:

1- Acessibilidade: por ex: cegos usam o celular de maneira diferente, clicks mostram audio e indicam o que são cada coisa

2- SEO: motores de busca, o robo do google acessa seu site pra rankear e ele precisa entender o que é cada parte do seu site, usar NAV ele vai saber que é uma navegação, se tiver uma lista dentro dele com UL ele vai saber que é uma lista não ordenada...

*dica extra: pra validar titulos, hierarquia da sua semantica use a extensão: https://chromewebstore.google.com/detail/html5-outliner/afoibpobokebhgfnknfndkgemglggomo?hl=pt-BR*

## Container - `<View />`

**header**

cabeçalho, topo da pagina

**main**

meio conteúdo da página (normalmente entre o header e o main)

**footer**

rodape, finalzin da pagina

**article**

independente e auto suficiente, faz sentido por si só, mesmo fora do conteudo da pagina

**section**

seção tematica de um documento
como um sobre nos, que precisa ter contexto da pagina

**diff SECTION/ARTICLE**
article é um container que pode ser tirado do site e publicado em outro lugar sem contexto
por exemplo: lista de receitas para almoço

section é um container que não pode ser tirado do site e publicado em outro lugar porque depende de contexto
por exemplo: sobre nós de uma empresa

**aside**

complemento de conteudo principal
(main ou article)
ou lateral

**ol**

lista ordenada
(dentro da lista cada item é um `<li>`)

**ul**

lista não ordenada
(dentro da lista cada item é um `<li>`)

**nav**

navegação, itens de navegação da página
(dentro normalmente vc vai usar uma `<ul>`)

## Texto - `<Text />`


**h1~h6**

titulos da pagina (com hierarquia, h1 é titulo da pagina, h2 é subtitulo, h3 é subtitulo de h2...)

**p**

paragrafo, textos que ocupam uma linha toda (largura total do elemento pai) com espaçamento vertical

**span**

texto menor, como contido dentro de algum outro lugar, como por exemplo uma parte de um texto dentro de um `<p>` que precisa de uma estilização especifica

## Botão/Texto Clicavel - `<TouchableOpacity />`

**a**

action com texto

**button**

action com botão


# Outras tags semanticas importantes

## Acessibilidade

**alt (da tag IMG)**

texto se a img n for carregada, pra motores de busca
 e acessibilidade pra quem não conseuger ver a img

**title (da tag BUTTON)**

mais sentido pra um button ou algo do tipo
exemplo:
`<button onclick="handleClick()" title="botao que vai levar pra tela de login">click me</button>`

## Outros

**tab index**

pra ir pulando de um pro outro
como em formulario que seguem sequencia de itens perfeita pra ir no tab ate chegar no final
