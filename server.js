const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const configuracoes = require('./config.json')
const Usuario = require('./app/models/usuario')

mongoose.connect(configuracoes.mongodb.url)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const porta = process.env.PORT || configuracoes.webserver.porta
const router = express.Router()

router.route('/bears')
  .post(function (req, res) {
    var bear = new Usuario()
    bear.name = req.body.name
    bear.save(function (err) {
      if (err) res.send(err)
      res.json({ message: 'Bear created!' })
    })
  })
  .get(function (req, res) {
    Usuario.find(function (err, bears) {
      if (err) res.send(err)
      res.json(bears)
    })
  })

router.route('/bears/:bear_id')
  .get(function (req, res) {
    Usuario.findById(req.params.bear_id, function (err, bear) {
      if (err) res.send(err)
      res.json(bear)
    })
  })
  .put(function (req, res) {
    Usuario.findById(req.params.bear_id, function (err, bear) {
      if (err) res.send(err)
      bear.name = req.body.name
      bear.save(function (err) {
        if (err) res.send(err)
        res.json({ message: 'Bear updated!' })
      })
    })
  })
  .delete(function (req, res) {
    Usuario.remove({
      _id: req.params.bear_id
    }, function (err, bear) {
      if (err) res.send(err)
      res.json({ message: 'Successfully deleted' })
    })
  })

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' })
})

app.use('/api', router)

// =============================================================================
app.listen(porta)
console.log('Magic happens on porta ' + porta)
