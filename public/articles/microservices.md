# intro

dividir seu backend em pedaços menores independentes (ou o mais próximo disso possível)

# como dividir?

em areas de dominio
atenção que entidades podem ter nomes diferentes em dominios diferentes, mas serem a mesma coisa

# dominios

areas de entendimento de um negocio

# entidade

exemplo salão de beleza:

cabeleireiro:
- cliente
- agendamento

financeiro:
- cabeludos
- pagamento


cabeludos = cliente
mas dependendo do contexto tem atributos/caracteristicas diferentes
dependendo da area de entendimento

por exemplo:
- atributo corte de cabelo
não faz sentido pro microserviço do financeiro

- atributo email
sim, blz, funciona pros dois

# armazenamento (db)

cada micro serviço deve ter sua propria estrutura de armazenamento
se não vira um monolito distribuidos
caiu o banco caiu tudo
um serviço tá pesado, deixa o DB lento, trava todos os outros
nenhum microserviço tem autonomia, o que é um dos principios de micro serviços


# pq usar

independencia manter online
independencia de equipes, times diferentes
independencia no fluxo de CI e CD (imagina cadastrou uma rota nova no mercadolivre ter q rodar todos os testes)
independencia de tecnologias, cada backend pode ser feito numa linguagem diferente
manutenção mais fácil (em um unico serviço vc altera a parte q vc precisa, sem ter q entender o escopo todo)

escalonamento independente

# desafios

## observabilidade
mercadolivre tem 10k apps
e não são só apps que ficam lá pra serem consumidas
são apps que estão se comunicando entre si

vc compra um produto
o web, fala com nota fiscal, com logistica pra entrega e por aí vai

## comunicação
compras | notas fiscal

padrão publi/sub

é uma comunicação assincrona

compra feita
msg broker publica

nota fiscal verifica a lista de msgs
ve que sei lá tem 3 compras, cria 3 notas fiscais e envia por email

### duplicidade de dados
cliente quer ver suas notas fiscais
tem que bater no sistema de compras, certo?
e se o sistema de compras estiver off? notas fiscais para de funcionar?

é mt normal duplicar dados em micro serviços

fez a compra, salva os dados num banco proprio
pra não ter esse tipo de problema
qnd o usuario precisar dessa informação, ele n precisa bater no serviço de compras
(SERVIÇO ALTAMENTE INDEPENDENTE)



## resiliencia a falhas
compras fala com nota fiscal pra cada vez q tiver uma compra ter uma nota fiscal
oq acontece se o serviço de nota fiscal morre?

ql mecanismo q as compras funcionem até que nota fiscal volte e faça as emissões de forma retroativa?


# dito tudo isso, aí podemos ir pro codigo
os conceitos são o mais importante
o código, as ferramentas, é o mais fácil

## kafka (TODO)
messageria TO-DO
compras, salas de aula
comprar, ficar na fila
salas de aula, startarar olhar compras pra matricular alunos



