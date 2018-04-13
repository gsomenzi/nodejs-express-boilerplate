const express = require('express')
const app = express()
const authMiddleware = require('./app/middlewares/autenticacao-middleware')
const bodyParser = require('body-parser')
const configuracoes = require('./config.json')
const mongoose = require('mongoose')
const morgan = require('morgan')
const porta = process.env.PORT || configuracoes.webserver.porta
const routers = {naoAutenticado: express.Router(), autenticado: express.Router()}

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
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

// ROTAS
require('./app/rotas/pre')(routers)
require('./app/rotas/autenticacao')(routers)
require('./app/rotas/usuario')(routers)
require('./app/rotas/default')(routers)
app.use('/api', routers.naoAutenticado)
app.use('/api', authMiddleware, routers.autenticado)
app.use(require('./app/rotas/erros'))

// INICIAR SERVIDOR WEB
app.listen(porta)
console.log(`- Servidor WEB iniciado na porta ${porta}`)
