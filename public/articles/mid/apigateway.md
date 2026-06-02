# intro
hj em dia não se usam só um sistemão enorme onde recebe todas as req
tem vários sistemas menores separados (micro-serviços), cada um com suas proprias APIs

- pra acessar produtos vc vai no serviço de produtos
- pra acessar receitas vc vai no serviço de receitas

como saber o endereço de cada micro serviços?
e se tiverem foras?

como fazer autenticação/autorização de todos esses micro serviços?

pra isso existe o API Gateway (e mais um pouco)

ela é como se fosse um muro de entrada pra seu mundo interno dos seus sistemas
quem ta de fora acessa um endereço apenas, com diversos endpoints
e a api gateway fica responsavel por encaminhar pros micro serviços de forma correta

quem ta de fora n sabe qnts microserviços tem

é o ponto de entrada

msm que não sejam micro serviços, que sejam vários sistemas API gateway resolvem isso


tem aplicações no mercado: amazon, azure
mas na globo a gente usava a do Kong, eu lembro vagamente de ver um painel web que configurava essa parada, era algo em LUA tbm

# redirecionar entre aplicações gerenciando endpoints pra serviços internos

# metricas de acesso e monitoramento

# autorização, autenticação

# rate limit, pra limitar o tanto de req que cada aplicação pode receber

# segurança
ja bloquear sql injection, xss

# cache
da pra fazer cache pra nem entrar no serviço
tipo rotaX/parametroY, já salva cache lá
nem vai pra API, já para ali a resposta

# pontos negativos
caro $$$$$$

# versionamento
pq na globo tinha accounts-v1/ accounts-v2/
???

# BFF

- [BFF (Backend For Frontend)](./bff.md)

organizar BFF, sem precisar ter que criar 2000 endpoints pra cada tipo um sistema grande