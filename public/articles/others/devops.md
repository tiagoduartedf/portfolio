# Introdução à Cultura DevOps

Antigamente, as áreas de infraestrutura e desenvolvimento eram separadas:

- **Operações (Ops)**: responsáveis por infraestrutura, sysadmins, SREs. Cuidavam de servidores físicos, virtualização, provisionamento manual e configuração de aplicações.
- **Desenvolvimento (Dev)**: times de produto (front-end, back-end, DBAs), que codificavam e solicitavam ambientes para rodar suas aplicações.

Esse modelo criava barreiras entre as equipes, dificultando a comunicação, atrasando entregas e tornando a manutenção mais complexa.

Com a **cultura DevOps** e o surgimento de novas ferramentas, essa separação começou a desaparecer. Hoje, desenvolvedores e times de infraestrutura compartilham responsabilidades, linguagens e ferramentas para implantar, escalar, monitorar e manter sistemas com muito mais agilidade e segurança.









## Containers e Docker

Ferramentas como o **Docker** permitem empacotar sua aplicação junto com todas as dependências, bibliotecas e configurações em um ambiente isolado chamado *container*.
Isso resolve o clássico problema de “funciona na minha máquina, mas não em produção”, garantindo que a aplicação rode da mesma forma em qualquer ambiente, seja localmente, em servidores ou na nuvem.

Com uma linguagem declarativa em um arquivo chamado `Dockerfile`, você define:
- qual sistema operacional base utilizar,
- como instalar as dependências,
- como construir (buildar) sua aplicação,
- e como ela deve ser executada.

A partir desse `Dockerfile`, o Docker gera uma **imagem**, que funciona como uma "receita de bolo" da aplicação. Essa imagem é **imutável**, reprodutível e pode ser enviada para qualquer lugar, permitindo que outras pessoas ou servidores criem containers idênticos a partir dela.

**Imagem** = modelo
**Container** = instância rodando dessa imagem

Diferente de máquinas virtuais, containers **não carregam um sistema operacional completo**.
Eles compartilham o **kernel da máquina host** e isolam apenas o que for necessário. No fim das contas, **um container é apenas um processo isolado rodando no host**, com seu próprio sistema de arquivos, variáveis de ambiente, rede e tudo mais que a aplicação precisa.

Essa leveza torna os containers **muito mais rápidos, eficientes e fáceis de escalar** do que VMs, perfeitos para automatizar deploys, criar ambientes padronizados e rodar aplicações em produção com confiança.


## Orquestração com Kubernetes

Com a popularização dos containers, surgiu a necessidade de gerenciar muitos deles ao mesmo tempo. É aí que entram os **orquestradores de containers**, como o **Kubernetes** (open-source) ou o **ECS** da **AWS** (serviço gerenciado).

Essas ferramentas automatizam o ciclo de vida dos containers e fornecem recursos avançados, como:

1. **Escalonamento automático**
   É possível escalar horizontalmente (aumentar o número de réplicas da aplicação) com base no uso de CPU, memória ou outras métricas.

2. **Load balancing integrado**
   O orquestrador distribui automaticamente o tráfego entre as réplicas da sua aplicação, garantindo alta disponibilidade.

3. **Deploy contínuo com zero downtime**
   Faz **rolling updates**, atualizando uma instância por vez para evitar interrupções.
   Se algo der errado, pode realizar **rollback automático** para a versão anterior.

4. **Monitoramento e logs centralizados**
   Coleta métricas e logs de todos os containers, como uso de CPU, número de requisições e falhas.
   Pode ser integrado com ferramentas como **Prometheus** (coleta de métricas) e **Grafana** (visualização de dados).

5. **Autocorreção de falhas**
   Se um container cair, o orquestrador detecta o erro e reinicia automaticamente, sem intervenção humana.

6. **Isolamento de ambientes**
   É possível organizar diferentes ambientes (dev, staging, produção) usando **namespaces** ou clusters distintos.

7. **Controle de acesso e segurança**

   Orquestradores como o Kubernetes oferecem diversas ferramentas para garantir que cada aplicação, usuário ou serviço só tenha acesso ao que precisa:

- **RBAC (Role-Based Access Control)**: controle de permissões baseado em funções. Define o que cada usuário, serviço ou aplicação pode fazer (ex: ler logs, criar pods, editar configurações).
- **Network Policies**: controlam o tráfego entre pods, permitindo ou bloqueando a comunicação entre eles com base em regras.
- **PodSecurityPolicy**: define restrições de segurança para os pods (ex: não rodar como root, usar volumes somente leitura, etc).
- **Secrets**: mecanismo para armazenar dados sensíveis como senhas, tokens e chaves de API de forma segura.
- **ServiceAccounts**: identidade que os containers usam para se comunicar com o cluster e acessar recursos específicos.
- **Admission Controllers**: interceptam e validam requisições antes que elas sejam aplicadas no cluster (ex: impedir a criação de recursos fora do padrão).


8. **Agendamento de tarefas**
   Permite executar containers em horários programados, como tarefas de background ou cron jobs.
   Exemplo: rodar `limpardb.js` todos os dias às 03:00 da manhã.

---

Com isso, orquestradores como o Kubernetes não só facilitam o gerenciamento de containers em escala, como também aumentam a confiabilidade, automação e segurança da infraestrutura.

---

## docker-compose

Docker Compose é amplamente usado em ambientes de desenvolvimento, enquanto Kubernetes é mais comum em produção.

✅ Por que usar Docker Compose no dev?
- É muito mais simples de configurar que Kubernetes
- Você descreve os serviços no docker-compose.yml e sobe tudo com um único comando (docker-compose up)
- Perfeito pra simular ambientes locais com múltiplos serviços (ex: API + banco + Redis)
- É uma ponte perfeita entre aprender Docker e depois evoluir pra Kubernetes

❌ Por que Kubernetes não é comum no dev local?
- É mais pesado, complexo e exige setup mais chato (ex: minikube, k3d…)
- Muitas equipes preferem usar K8s só na infra de staging e produção, onde os benefícios de escalabilidade e automação valem a pena

Concluindo
> 💡 Embora Kubernetes seja o padrão para orquestração em produção, em ambientes de desenvolvimento é muito comum usar o **Docker Compose**.
> Com ele, você pode definir múltiplos containers (ex: app, banco, cache) em um único arquivo `docker-compose.yml`, e subir todo o ambiente local com um simples `docker-compose up`.
> Isso facilita muito o trabalho local e simula bem a estrutura da aplicação sem precisar da complexidade do Kubernetes.










## Cloud e Infraestrutura como Código (IaC)

A popularização das **clouds** como AWS, Azure e Google Cloud aumentou muito a agilidade e a flexibilidade na hora de criar e manter infraestrutura.
Hoje é possível fazer todo um design de cloud, subir containers (ECS, EKS, AKS, GKE), Servless (Lambda, Functions, Cloud Run), Banco Gerenciado (RDS, DynamoDB, CosmoDB), Infraestrutura como Código (Terraform), Observabilidade distribuida (X-Ray, Datadog, Prometheus, Grafana Stack), balanceadores de carga, volumes de armazenamento e muito mais, tudo isso via interfaces web, CLIs ou APIs.


### Terraform · Declarando Infraestrutura com Código

Mas em vez de fazer tudo manualmente (WEB: clicando em botões ou CLI: rodando comandos), podemos **automatizar tudo com código**. É aí que entra o conceito de **Infrastructure as Code (IaC)**.

**Terraform** é uma das ferramentas mais populares de IaC.
Com ele, você escreve arquivos de configuração (`.tf`) em uma linguagem descritiva (HashiCorp Configuration Language, HCL), semelhante à ideia de um `Dockerfile`, só que para infraestrutura.

Esses arquivos descrevem *o que você quer ter*:
- uma máquina virtual,
- um banco de dados,
- um balanceador de carga,
- redes, regras de firewall, etc.

O Terraform lê esses arquivos e, através dos chamados **providers**, traduz esses comandos para chamadas reais à API da sua cloud (por exemplo, a API da AWS), criando os recursos automaticamente.

> Ou seja: um simples comando `terraform apply` pode criar toda a sua infraestrutura, de forma segura, rastreável e reproduzível.

#### Por que usar IaC?

- **Automação**: evita configurações manuais e repetitivas
- **Reprodutibilidade**: cria ambientes idênticos (ex: dev = staging = prod)
- **Versionamento**: todo o histórico da infraestrutura fica salvo no Git
- **Menos erros humanos**: configurações padronizadas e auditáveis
- **Destruição e recriação controlada**: com `terraform destroy` você pode remover tudo com segurança

Outras ferramentas com o mesmo objetivo incluem **Pulumi**, **AWS CDK**, **Ansible** (mais voltado a configuração) e **CloudFormation** (específico da AWS).

---

Com isso, você transforma o gerenciamento da infraestrutura em parte do processo de desenvolvimento, facilitando CI/CD, testes e colaboração entre os times.

















## CI/CD e Automação de Deploy

Depois de escrever código, empacotar com Docker, e configurar a infraestrutura com ferramentas como Terraform, entra o próximo passo da cultura DevOps:
**automatizar o processo de validação, entrega e deploy do software**.

É aí que entram os conceitos de **CI/CD** (*Continuous Integration* e *Continuous Delivery/Deployment*) e as plataformas de **pipelines de automação** como:

- **GitHub Actions**
- **GitLab CI**
- **CircleCI**
- **Argo CD**
- entre outras

Essas ferramentas permitem criar fluxos automatizados que testam, validam e até fazem deploy da aplicação sempre que algo novo é enviado para o repositório git.

---

### 🔁 O que é CI/CD?

CI/CD não é apenas uma ferramenta. É uma **filosofia de desenvolvimento moderno**, onde os times:

- Trabalham paralelamente na mesma base de código
- Integram mudanças continuamente (sem esperar o outro terminar)
- Automatizam verificações para evitar regressões e conflitos
- Tornam o deploy rápido, seguro e previsível

---

### ✅ Continuous Integration (CI) · Integração Contínua

O objetivo da CI é **validar automaticamente** todas as alterações feitas no código.

Exemplo de práticas de CI:
- Bloquear `main` para aceitar apenas *MRs aprovados*
- Rodar testes automáticos a cada *commit* ou *merge request*
- Rodar verificações segurança (exemplo: scan de dependências)
- Compilar/buildar a aplicação (pra validar se está buildando certo)
- Gerar artefatos (ex: imagem Docker)
- Enviar mensagens para times (Slack, Discord etc.)

Tudo isso garante que o código esteja funcionando e integrado corretamente com o restante do projeto, sem quebras, sem surpresas.

### 🚀 Continuous Delivery/Deployment (CD) · Entrega Contínua

O CD começa **após o CI**, e trata da **implantação automática da aplicação** em diferentes ambientes.

Exemplos:
- Um merge na branch `develop` pode **disparar um deploy automático** para o ambiente de desenvolvimento.
- Um merge na `main` ou `master` pode **disparar deploy para produção**.

Esse fluxo permite que a aplicação esteja sempre atualizada em todos os ambientes, facilitando testes, homologação e liberação contínua de versões.

**GitOps**
Com ferramentas como **ArgoCD** (agente automatizado), é possível acompanhar o Git e quando há uma mudança no Git, o agente aplica automaticamente essa mudança no ambiente (por exemplo, no cluster Kubernetes).


---

### ⚙️ CI/CD é um pipeline

CI (Integração Contínua): inclui testes, lint, validações, segurança, etc. Tudo que garante que o código está saudável após um push.
CD (Entrega ou Deploy Contínuo): começa após o código estar validado, e inclui buildar, armazenar artefatos e fazer deploy.

ao puxar um código pro git em uma branch que tenha pipelines:
CI:
1. Rodar testes unitários e de integração
2. Fazer *lint*, validações e escaneamento de segurança
3. Buildar imagem Docker
CD:
4. Subir a imagem docker para um **registry**, um repositório remoto onde as imagens Docker ficam armazenadas e disponíveis para serem usadas em deploys (ex: Docker Hub, GitHub Container Registry, AWS ECR)
5. Fazer deploy nos ambientes
6. Enviar logs, alertas ou mensagens

Tudo isso de forma **repetível, segura e sem intervenção manual**.

> Se algum passo falhar, o pipeline pode parar automaticamente e enviar alertas, evitando que código com problemas chegue em produção.

---

### 🎯 Resumo

CI/CD transforma o processo de entrega de software em algo:
- **Automatizado**
- **Rápido**
- **Confiável**
- **Auditável**

Ele se conecta com todos os outros tópicos:
- Pega o código feito por múltiplos devs (CI)
- Empacota com Docker (containers)
- Usa infraestrutura criada com Terraform (IaC)
- Faz deploy automático nos clusters (Kubernetes)

Esse é o coração da cultura DevOps: integração entre dev e ops, com máxima automação.












## Observabilidade e Monitoramento

Depois que seu código está em produção, o ciclo DevOps continua
DevOps não é só automatizar deploy. Também envolve monitorar, detectar problemas, agir rápido e entender o que está acontecendo na produção

Você precisa:
- Saber se a aplicação está saudável
- Detectar quedas ou lentidões
- Entender o comportamento do sistema com base em dados e sinais reais
- Gerar alertas, logs, gráficos, históricos, etc.

É aqui que entram as ferramentas de **observabilidade**.

---

### O que é Observabilidade?

Observabilidade é a capacidade de entender o que está acontecendo internamente em um sistema, a partir de sinais externos.
Esses sinais são geralmente divididos em três pilares:

- **Logs**: registros de eventos e mensagens da aplicação
- **Métricas**: números e contadores (ex: uso de CPU, requisições por segundo)
- **Traces**: rastreamento de requisições entre serviços

---

### Ferramentas populares

- **Prometheus**: coleta e armazena métricas com alta performance e granularidade.
- **Grafana**: cria dashboards visuais e alertas com base nas métricas do Prometheus (ou outras fontes).
- **Alertmanager**: envia alertas baseados em regras do Prometheus (ex: “CPU > 90% por mais de 5 minutos”).
- **Loki**: sistema de logs leve, integrado ao Grafana.
- **ELK Stack** (Elasticsearch, Logstash, Kibana): alternativa poderosa para logs e visualização.

---

### Exemplo de uso em DevOps

- Cada container no Kubernetes expõe métricas (via `/metrics`)
- O **Prometheus** coleta essas métricas periodicamente
- O **Grafana** exibe gráficos em tempo real
- O **Alertmanager** dispara um alerta (Slack, e-mail, etc) se algo sair do normal
- O time de DevOps responde rapidamente com base nas informações exibidas

---

### Por que isso é importante?

Com observabilidade, você:
- Detecta problemas antes dos usuários reclamarem
- Ganha agilidade na resposta a incidentes
- Aprende com falhas reais para melhorar os próximos deploys
- Facilita decisões técnicas com dados reais

---

> Em resumo: **quem não monitora, programa no escuro.**
> Observabilidade fecha o ciclo DevOps com visibilidade, segurança e evolução contínua.










## Cultura além da ferramenta

Resumindo:
DevOps não é só ferramenta. É cultura:
- Colaboração entre Dev e Ops
- Automação de tudo que for possível
- Feedback rápido e entrega contínua
- Monitoramento e melhoria constante
