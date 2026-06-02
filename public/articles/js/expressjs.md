# intro
Express.js é um framework para desenvolvedores Node.js criarem backends APIs de maneira rapida e eficiente.

Com ele você pode criar rotas HTTP com os verbos GET,POST,PUT,DELETE e criar funções que serão processadas no backend através dele.

*req, res*

Também pode criar middlewares que passarão antes dessas rotas, como um gerenciamento de login ou log como no exemplo abaixo

# exemplo de uso:

```js
const express = require('express');
const app = express();
const port = 3333;

// Middleware para parsear JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} request to ${req.url}`);
  next(); // Chama o próximo middleware ou rota
});

// Rota para requisições GET no endpoint raiz
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Rota para requisições POST no endpoint /submit
app.post('/submit', (req, res) => {
  const data = req.body;
  res.send(`Data received: ${JSON.stringify(data)}`);
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
