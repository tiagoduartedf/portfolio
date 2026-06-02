# javascript single thread? event loop?

# intro
Javascript é uma string que um programa interpreta, transpila e executa, não existe referencia na implementação da linguagem que diga que ela tenha que ser single thread

As implementações do Browser ou do NodeJS que implementam o javascript de forma single thread pelo Event Loop usando as libs V8 e LIBUV (foi pensado pra ser assim, thread safe)
mas dentro desse "while true" do event loop é possível rodar codigos em paralelo, até pq é um código C++
mas tbm da pra travar tudo se vc não souber oq está fazendo

## always has been C libraries
![img](./alwayshasbeen-clibs.png)

`node programa.js` não roda um programa em JS, ele vai transpilar o codigo e vai rodar um programa em C++ (V8+LIBUV, msm engine do Chrome)
`browser` não é JS, ele usa a forma dele pra interpretar o código JS

### Demonstração de um código JS transpilado pro C++ (V8) com Multithread:
https://gist.github.com/ngot/4e363c08c1a912f3f10fda882a9e3956





# NodeJS, modelo de execução
- Node.js is actually a C++ program who makes an interface between V8 and LibUV
  - When using C++ you can either use LibUV threads or C++ native threads if you want
  - But to execute a JavaScript code, you must create an isolate, which is a new independent VM instance to run tasks


NodeJS tem um modelo de execução divido em 3 partes
(assincrono, pelo fato da libuv ser assincrona)

## 1- motor de execução (v8) [interpreta o código js]
le o arquivo e executa, esse processo é single thread (é como fazer um post numa api)
a v8 não necessariamente só roda seu codigo, ela transforma seu codigo em instancias de objetos em c++
- Node.js used to spin up 4 instances of the VM 


## 2- libuv [manipula e aguarda por eventos] [assincronas, timers, threads]
- Lib uv also has sincronous tasks that's why it spins up 4 threads by default
- acts like an while loop asking for events
- it's responsible to create threads, schedule async operations, create timers and more

libuv consegue criar os subprocessos pra delegar pro SO

lib c++ pra executar funções assincronas (consegue criar threads, timers, funções assincronas), ele delega pro SO pra executar

não existe single thread aqui, isso aqui é c++, rust oq o SO for usar
(js não consegue fazer nada, pq js não faz nada, depois da string traduzida quem faz são essas outras linguagens)
nativamente ele já cria 4 threads





### event loop libuv

#### escutando evento e respondendo, event loop
é um while true, fica o tempo todo perguntando se tem algum evento, função assincrona, thread pra executar
- existe programação paralela

#### travar o node como um especialista, sabendo como travar
ainda que tenhamos threads elas tem que responder ao orquestrador de eventos (event loop) que é single thread
o processo do event loop é single thread, ele consegue pegar as respostas de forma ordenada pra não deixar que 2 threads altere a msm variavel e quebrar o código (thread safe)

um trexo de código aqui pode travar:
pedir pra libuv executar uma chamada assincrona ou uma thread não travaria o node, 
mas ler um arquivo por exemplo e dps executar linha a linha, converter de CSV pra JSON, isso executado pelo c++ (libuv) pode travar o eventloop se mal executado
evitar loop grande em memoria, se não ele não consegue executar os pedaçinhos do codigo

#### o passar de batata quente:
oq muda pras outras plataformas concorrentes?
o nodejs qnd termina de executar a tarefa/thread, ele envia de volta pro libuv, pro libuv continuar sabendo oq tem q fazer






## 3 nodejs [intermediario, controlador] [proxy]
vem uma msg, um escrito, ele interpreta, manda pra v8, que manda pra libuv, libuv respondeu?
o node pega a respostas do v8 e manda pro js pra cima de novo pela api do v8

no fim, tudo que tá sendo executado lá embaixo é c++








## minha conclusão (posso estar falando merda, como sempre)
no final das contas parece que da pra usar node pra quase tudo, só perdendo pra linguagens compiladas
pq esse processo de transpilar codigo deve perder performace
(provavelmente insignificante, mas se vc precisa do maximo de performace, se vc tá fazendo algo embarcado [headfones, cameras, wireless caixas de som] ou algo do tipo, talvez é melhor fazer com linguagem compilada)

e as `Worker Threads` são mais pesadas que threads normais do C++ por exemplo
pq elas sobem uma VM toda do node, mesmo que super performaticas e tals não são como threads nativas
(o que não te impede de injetar código C++ no seu node, já vi lib fazendo isso)

só vale lembrar o lance que o v8 é single thread, então as entradas tem q vir de 1 a 1 (???)
e o event loop do libuv é um gerenciador sincrono de eventos assincronos, então cuidado pra não fazer merda






normalmente não vale a pena ficar usando 2 linguagens pra front/back
tudo tem seu onus e bonus, mas normalmente não vale a pena pensando em valor de negocio

a curva de aprendizado de um time pra uma linguagem, mesmo que linguagem seja só uma ferramenta
muito tempo de adaptação pra um time pra uma linguagem (desenvolvedor tem um preço)
ou até mesmo 2 times um pra mexer com front outro pra mexer com back (2x desenvolvedor tem 2x preço)

por causa de 100ms,200ms,300ms ou até 400ms que seja, provavelmente o seu usuário final nem vai sentir essa velocidade que vc ta vendendo
produtivida & entrega & preço > perfomace provavelmente desnecessaria








# ==========================================================================================================================================


# perguntas q eu ainda não sei responder

## motivos pra usar thread, pq isso deveria ser uma preocupação?
processamento de imagens,videos
ou até ganhar mais performace


threads são só pra tarefas que vão bloquear o node? pq qnd escolher entre promises e threads?
me parece ser só qnd vai bloquear o node, mas threads tbm podem ser usadas pra ganhar performace

queria exemplos reais disso em produção, pq pra um crud normal não me parece fazer sentido...





uma boa sacada pra qnd usar threads, é vc ta executando linha a linha travando e não precisava?
se pa é a hora
lidar com audio e video q são pesados ou
ex: pegar dados de um csv grande e consultar ao banco pra validar se os arquivos q tão no csv estão no banco
poderia quebrar esse csv em pedaços, ajustar o pool de conexão do banco e mandar geral pro banco pra ser consultado (claro com o limite do banco)

comparar 2 arquivos gigantecos





















# service worker VS thread
worker thread cria threads
mas a v8 é tão rapida pra criar um novo objeto (maquina virtual), que qnd a gente precisa criar uma nova thread no node, ao invés de a gente usar a thread do c++ diretamente, eles criam uma nova maquina virtual do node (totalmente optimizada), jogando esse processamento da libuv junto com o contexto da libv8

as worker thread do node são threads, mas que rodam em outra maquina virtual (outro intepretador executando a thread)
qnd ela termina, ela manda msg de volta pro libuv, ai sim ele retorna pro cliente


(worker threads são novos)




























# async await?
é uma abstração do callback

promises são executadas no v8 (são microtasks) não é uma função assincrona que executa na libuv, não é tbm oq vai executar sincrono

callback: qnd a libuv terminar a execução, chama o resolve dessa função e ela vai concluir a promise

no final das contas é pra evitar callback

uma promise bloquearia o eventloop, assincrono é diferente de concorrencia, é como se vc fosse executar pedaçinhos de poquinho em poquinho


# garbage collector
o v8 (c++) tem o garbage collector dele lá
qnd a gente cria a nossa thread, ele cria a maquina virtual optimizada e ela já tem o proprio garbage collector

(parece q cada VM tem o seu)





# Worker Threads, Child Process
- Process 
  - Your program itself
  - When you create copies of your Node.js program on your infraestructure usually you're creating new processes 

- Child Process or subprocesses
  - They stablish communication channels
  - Used to create a whole new process with dedicated memory and expensive
  - One process can have many threads
  - People used to use child process to offload the bottlenecks from a single process in Node.js 
  
- Threads
  - threads are small unities of processing and shares memory and resources 
  - uses a lot less memory and it lives inside a process 
  - used to perform CPU intensive tasks
  
- Worker Threads 
  - it's still expensive because it creates a new V8 instance, a new event loop but still uses less resources 
  - it's thread safe because it will send events back to the main event loop
  - it doesn't make sense to spin a thread per request as it'll rely on event loop anyway, that's the main difference to Java and other programming languages

### Diferença Worker Threads && Child Process
Worker Threads e Childn Process são bem similares, foram criados pra rodar tarefas bem pesadas em outra instancia do nodejs sem afetar o processo pai
a diferença é:
worker threads: CPU intenssivo
child process: IO



















# fontes:


## stackoverflow resposta explicativa
Is Node.js considered multithreading with worker threads?
https://stackoverflow.com/questions/63224356/is-node-js-considered-multithreading-with-worker-threads/63225073#63225073

### não entendi:
"
So, just because we have WorkerThreads, that doesn't mean that you can now program networking in JavaScript like you sometimes do in Java with a separate thread for every new incoming request. That part of JavaScript's model doesn't change at all. If you have an HTTP server in Node.js, it's still receiving one incoming request at a time and won't start processing the next incoming request until that prior incoming request returns control back to the event loop.
"

"
While useful in some cases, these WorkerThreads are much, much more heavyweight than an OS level thread. I think of them as if they're almost like mini child processes, but with the advantage that they can use SharedMemory between WorkerThreads or between the main thread and WorkerThreads which you can't do with actual child processes.
"

## video erick wendel
https://www.youtube.com/watch?v=f7MY2OtI7nA
https://github.com/ErickWendel/nodejs-multithreading-examples/blob/main/preclass/annotations.txt
https://github.com/ErickWendel/nodejs-multithreading-examples/tree/main/recorded


