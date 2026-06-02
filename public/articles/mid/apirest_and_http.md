# API-REST

**to-do**

# HTTP

## VERBOS http (GET,DELETE,POST,PUT,PATH)
GET- pegar
DELETE- apagar
POST- criar
PUT- editar (tudo)
PATH- editar (parte)

## STATUS de resposta (200,400,500)

### 2xx são sucessos:
200 - Ok: requisição foi bem-sucedida.
201 - Created: requisição foi bem-sucedida e resultou na criação de um novo recurso.

### 3xx (Redirecionamento): Indica que mais ações devem ser tomadas para completar a requisição.
Exemplo: 301 Moved Permanently, 302 Found (ou temporário).

### 4xx são erros do cliente:
400 - Bad Request: requisição feita pelo cliente é inválida, como sintaxe inválida ou parâmetros ausentes.
401 - Unauthorized: Indica que o cliente não possui autorização para acessar o recurso solicitado && pode precisar realizar autenticação.
403 - Forbidden: Indica que o cliente possui autenticação válida, mas não possui permissão para acessar o recurso solicitado.
404 - Not Found: Indica que o recurso solicitado não foi encontrado no servidor.

### 5xx são erros do servidor:
500 - Internal Server Error: Indica que ocorreu um erro interno no servidor que impediu que a requisição fosse completada. Esse é um erro genérico que pode ocorrer por uma variedade de razões, como falhas no código do servidor, problemas no banco de dados, entre outros.
502 - Bad Gateway: Indica que o servidor, enquanto agindo como um gateway ou proxy, recebeu uma resposta inválida do servidor upstream.
503 - Service Unavailable: Indica que o servidor está temporariamente indisponível devido a sobrecarga ou manutenção. Geralmente, esse erro é acompanhado de uma mensagem indicando quando o serviço pode estar disponível novamente.
504 - Gateway Timeout: Indica que o servidor, enquanto agindo como um gateway ou proxy, não recebeu uma resposta oportuna do servidor upstream ou da origem.