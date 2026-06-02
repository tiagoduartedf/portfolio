# intro

container isola o ambiente de uma aplicação
pra acabar com aquele historia de roda na minha maquina
além de poder trazer da sua maquina o ambiente igual o de produção

lá vc pode instalar SO, dependencias, libs

# docker

container é um conceito, pra isolar do SO hospedeiro
sem ver processos, variaveis de ambientes
é um processo isolado, sem acesso aos outros procesos, não é uma VM
o docker é uma ferramenta pra lidar com containers, a principal, open source, grátis



# container VS vm
container é um intermedio entre VM e o ambiente principal

vm são feitas como se tivessem usando um hardware real
containers emulam parte disso e compartilham o kernel com o host

kernel é o core do SO, é a ponte entre o software pede e o que o hardware faz
lidando com tarefas de low lvl como CPU, gerenciamento de memoria, device IO
file system, process manangement

# intro
container = execução de uma imagem
imagem = classe
container = instancia da classe


docker build
docker run


# multi stage build
---


(orquestrador) não se usa docker-compose em prod, é pra dev




# cmds

sudo docker run bc6434c28e9a -e MARIADB_ROOT_PASSWORD,='pass123'

sudo docker run -d -t -i -e REDIS_NAMESPACE='staging' \ 
-e POSTGRES_ENV_POSTGRES_PASSWORD='foo'





docker ps -a
docker rm ID

docker images
docker rmi ID

docker network ls
docker network rm

docker-compose build
docker-compose up
docker-compose down


docker exec -it c365bf2720fa bash



docker-compose -f docker-compose.web.yml up
docker-compose -f docker-compose.web.yml down

docker-compose -f docker-compose.web.yml up
docker-compose -f docker-compose.web.yml down




docker logs 665ce2807f42




## push/pulll

criar repositorio no site com nome:
https://hub.docker.com/
`iveg-back`

logar pra dar cmd
`docker login`

taggear e enviar:
`docker tag iveg-back-node-prod:1.0.0 aszarth/iveg-back:1.0.0`
`docker push aszarth/iveg-back:1.0.0`






# todo

https://otland.net/threads/how-to-run-old-tfs-on-docker.278002/
