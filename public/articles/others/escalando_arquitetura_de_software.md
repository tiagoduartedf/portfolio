arquitetura a nivel de escala

# vertical e horizontal
vertical = deixar maquina mais forte (cpu, memoria...)
horizontal = desmembrar a aplicação pra conseguir subir instancias, redundancia


# escalar horizontal:

## API - escalar req (dns pra api)
loadbalancer

# BANCO - escalar DB
bancos slaves
teorima CAP, consistencia forte, consistencia fraca, consistencia eventual






# cache
melhorar a camada da aplicação
adicoinadno uma camada de cache
dados mt requisitados ficar em memoria ao inves do banco, pra ficar mais rapido

acho que não é cache no backend, é um (ou mais) servidor de cache








# elasticidade (auto scale) - ainda na horinzotal
configurar subir mais ou menos instancias automaticamente (escala horizontal)
com cloud, kubernets

com minimo e maximo
minimo pra rodar, maximo com alerta pra não financiar uma moto


# datacenters diferentes

loadbalancer na frente de tudo
um em BR, outro no NA

pra fazer `failover`
pq se acontecer um desastre fisico, redirecionar


e como replicar bancos de dados?
em servidores diferentes



# menssageria

comunicação entre micro serviços
arquitetura voltada a eventos
pra processamento de trabalho pesado em background
ou
pra notificar N areas de forma assincrona






# final
tendo tudo isso
messageria é pra milhões, mas mesmo sem já é milhão
vai precisar de outras coisinhas pra escalar:
- automação: (tu n vai fazer deploy em 200 lugares diferentes manualmente, tem que ter CI/CD)
- monitoramento: saber a saude do teu datacenter, bancos de dados, pra fazer analises e evlouir a arquitetura 
- logs: 
- metricas: 


