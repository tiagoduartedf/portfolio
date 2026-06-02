# NextJS

## BFF implementado
nextjs é um framework pra lib react que implementa um servidor do lado do front end com diversas funcionalidades
como um sistema de rotas bem feito, otimização de imagem, fonte dentre muitos outros (https://nextjs.org/docs/getting-started)

## SPA
o next veio pra resolver problemas gerados pelo SPA (single page application), que é o modo padrão do react

Que é melhor do que uma pagina HTML normal ou um site php, que re-renderiza tudo ao fazer uma alteração.

Mas se faz necessario renderizações no lado do servidor, arquivos estaticos e outras coisas que o Next vem pra oferecer.


## Data Fetching - CSR, SSG, SSR, ISR, Dynamic Routing
https://nextjs.org/docs/basic-features/data-fetching/overview
as funcionalidades que mais fizeram o next ficar popular são as de data fetching
são várias, cada uma pra uma situação e com uma vantagem (SEO, cache pra pagina ficar mais leve e rapida)

### CSR (Client Side Rendering)
SPA, react normal, full js

```
Renderização do lado do cliente, onde o React renderiza dinamicamente o conteúdo no navegador, ideal para SPAs.
```

### SSG (Static Site Generation)
site estatico compilado mais leve, html full client

```
Geração estática de páginas, onde o conteúdo é pré-renderizado em tempo de build, resultando em um site estático e leve.
```

### SSR (Server Side Rendering) 
site estatico compilado, mas do lado do servidor no backend do frontend next
```
Renderização do lado do servidor, onde o conteúdo é renderizado no servidor antes de ser enviado para o navegador do cliente, útil para melhorar o SEO e a performance inicial.
```


### ISR (Incremental Static Regeneration)
mistura entre SSG e SSR, cache estatico do front atualizando de tempos em tempos com info do back
```
Regeneração estática incremental, que combina os benefícios da geração estática com a capacidade de atualizar periodicamente as páginas estáticas com dados mais recentes.
```