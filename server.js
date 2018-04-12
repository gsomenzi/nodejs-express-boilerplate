const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const configuracoes = require('./config.json')
const Usuario = require('./app/models/usuario')

mongoose.connect(configuracoes.mongodb.url)
  .then(res => {
    console.log('- Banco de dados conectado com sucesso.')
  })
  .catch(err => {
    console.log('- Falha ao conectar o banco de dados.')
    console.log(err)
  })
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const porta = process.env.PORT || configuracoes.webserver.porta
const router = express.Router()

router.route('/usuarios')
  .post(function (req, res) {
    var usuario = new Usuario()
    usuario.name = req.body.name
    usuario.save(function (err) {
      if (err) res.send(err)
      res.json({ message: 'Usuario criado!' })
    })
  })
  .get(function (req, res) {
    Usuario.find(function (err, usuarios) {
      if (err) res.send(err)
      res.json(usuarios)
    })
  })

router.route('/usuarios/:idUsuario')
  .get(function (req, res) {
    Usuario.findById(req.params.idUsuario, function (err, usuario) {
      if (err) res.send(err)
      res.json(usuario)
    })
  })
  .put(function (req, res) {
    Usuario.findById(req.params.idUsuario, function (err, usuario) {
      if (err) res.send(err)
      usuario.name = req.body.name
      usuario.save(function (err) {
        if (err) res.send(err)
        res.json({ message: 'Usuario atualizado!' })
      })
    })
  })
  .delete(function (req, res) {
    Usuario.remove({
      _id: req.params.idUsuario
    }, function (err, usuario) {
      if (err) res.send(err)
      res.json({ message: 'Usuario removido' })
    })
  })

router.get('/', function (req, res) {
  res.json({ message: 'Bem vindo a API!' })
})

app.use('/api', router)

// =============================================================================
app.listen(porta)
console.log(`- Servidor WEB iniciado na porta ${porta}`)
