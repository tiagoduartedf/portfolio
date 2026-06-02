opinativo

decorator
forma de dar funções pra classe

por exemplo nos controlers (arquivos que recebem requisições de outros softwares, http)
@Get()
diz que a rota é  


provider = qlqr coisa que não seja um controller
services, repositories


inversão de dependencias && injeção de dependencias


inversão de dependencias (D do solid)
=
quem chamar o controller envia as dependencias (no construtor tem o código q chama o service)


injeção de dependencias
=
nest tbm usa injeção de dependencias
AppModules qnd importa AppController não envia a dependencia q ele precisa, que é o AppService
nest automaticamente detecta que como eu falei que o appservice é do tipo AppService ele automaticamente identifica que tem um provider desse msm tipo e injeta automaticamente

pra isso funcionar o AppService precisa ter o carinha: `@Injectable`


- tem integração direta com o mongo e tbm tem integração com o mongoose


vamos fazer olhando a docs
copiando codigo do diego a gente não vai aprender
melhor fazer errado, revisar e ajustar, n tem como errar mt com algo opinado
o ruggeri sabe mexer qlqr coisa peço pra ele revisar, ele deve querer participar tbm

