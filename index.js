// Importar módulos
const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');


// Configurar o servidor
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar o banco de dados
const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'suasenha',
  port: 5432,
});
client.connect();

// Criar rota para cadastro
app.post('/cadastro', async (req, res) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).send({ error: 'Usuário e senha são obrigatórios' });
  }

  try {
    const result = await client.query(`SELECT id FROM usuarios ORDER BY id DESC LIMIT 1`);
    const id = result.rows[0].id + 1;
    await client.query(`INSERT INTO usuarios (id, usuario, senha) VALUES (${id}, '${usuario}', '${senha}')`);
    return res.send({ message: 'Usuário cadastrado com sucesso' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: 'Erro ao cadastrar usuário' });
  }
});

// Criar rota para login
app.post('/login', async (req, res) => {
    const { usuario, senha } = req.body;
  
    if (!usuario || !senha) {
      return res.status(400).send({ error: 'Usuário e senha são obrigatórios' });
    }
  
    try {
      const result = await client.query(`SELECT * FROM usuarios WHERE usuario = '${usuario}' AND senha = '${senha}'`);
      if (result.rows.length === 0) {
        return res.status(401).send({ error: 'Usuário ou senha incorretos' });
      }
      return res.send({ message: 'Login realizado com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ error: 'Erro ao realizar login' });
    }
  });

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
