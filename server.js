const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const configuracoes = require('./config.json')

// BANCO DE DADOS
mongoose.connect(configuracoes.mongodb.url)
  .then(res => {
    console.log('- Banco de dados conectado com sucesso.')
  })
  .catch(err => {
    console.log('- Falha ao conectar o banco de dados.')
    console.log(err)
  })

// SERVIDOR WEB
const porta = process.env.PORT || configuracoes.webserver.porta
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

// ROTAS
const router = express.Router()
require('./app/rotas/pre')(router)
require('./app/rotas/autenticacao')(router)
require('./app/rotas/usuario')(router)
require('./app/rotas/default')(router)
app.use('/api', router)
app.use(require('./app/rotas/erros'))

// INICIAR SERVIDOR WEB
app.listen(porta)
console.log(`- Servidor WEB iniciado na porta ${porta}`)
