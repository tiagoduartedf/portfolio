# intro

observabilidade é uma caracteristica da sua aplicação
conhecer oq ta acontecendo na sua aplicação
no nivel tecnico principalmente, mas tbm a nivel de negocio

# Monitorar

## APM
profiler SAMP

## Graficos
prometheus cria dados pra metricas para serem acessadas no grafana


# garantir uptime
quando sua app da cai/laga:
vc visualiza isso num dashboard?
recebe um alerta?
ou recebe uma ligação do seu cliente?


## não é apenas sobre isso
não é só saber qnd da problema, 
ter dados o suficiente pra entender o fluxo da aplicação
(eventos que ocorrem, quantidade de acesso, quantidade de erros)

pra conseguir entender como/onde escalar a aplicação
prever problemas e resolve-los
e tbm encaminhar possiveis melhorias e features


## micro serviços, mais dificil de monitorar
observabilidade não é uma novidade, mas com o crescimento de
microserviços e computação em nuvem
se torna cada vez mais necessario

as vezes uma simples request passa por diversos microserviços

e hj em dia vc sobe 3 instancias de app, sobe maquina, destroi
é necessário ter um sistema especifico pra logs pra encontrar esses logs em algum local
não da pra ficar em um servidor que vai ser destruido a cada momento

## CI/CD
isso não vale só pra PROD, vale pra CI/CD tbm
se ao implementar uma feature tem perca de performace, vc da rollback e entende e resolve o problema


## alarmes
não é só dashboard
ninguém fica olhando dashboards o tempo todo
quando alguma coisa fica ruim vc tem que receber uma msg
(uso de cpu alto, vendas pararam...)





# 3 pilares para garantir observabilidade
observabilidade pode ser dividida em 3 pilares:
log, metrica e tracing

## log
registros em formato textual
eventos no sistema ou no ambiente em que ele está sendo utilizado

### ferramentas:
elastic search (ELK - elastic stack: normalmente usado com kibana, logstash, beats)
loki
grey log






## metrica
representações numericas
relacionados em valores quantitativo
e armazenados baseados em uma linha do tempo

CPU, memória consumida, quantidade de acesso, quantidade de erros

pra entender se/como/onde tem que escalar meu sistema
e garantir que tudo vai ficar no ar

### metricas de negocio tbm:
não só pra qnd da problemas
metricas pra: paginas mais acessadas, vendas por hora, usuarios colocaram produtos no carrinho, compras desistidas

a intenção é entender a app, não só entender possíveis problemas
até pra descobrir anomalia
e ajudar na tomada de decisão do time de negocio, novas features

### ferramentas:
prometheus
new relic
data dog

grafana (não é ferramenta de metricas, mas é utilizado em conjunto pra mostrar num dashboard)






## tracing
rastrear todo fluxo de uma requisição entre os serviços
capaz agregar todos os eventos (logs) das aplicações em um ID correlacionado
pra acompanhar todo trajeto da requisição
pra entender oq aconteceu e encontrar uma solução

### ferramentas:

jaeger

grafana (visualização tbm)









# diferença de observabilidade e monitoração


