const configuracoes = require('../../config.json')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schemaUsuario = new Schema({
  dtCriado: {type: Date, required: true},
  dtAtualizado: {type: Date},
  nome: {
    type: String,
    required: [true, 'O nome completo deve ser informado.']
  },
  usuario: {
    type: String,
    required: [true, 'Um nome de usuário deve ser informado.'],
    index: {
      unique: [true, 'O nome de usuário já está em uso.']
    }
  },
  email: {
    type: String,
    required: [true, 'Um endereço de e-mail deve ser informado.'],
    index: {
      unique: [true, 'O endereço de e-mail já está em uso por outro usuário.']
    }
  },
  senha: {
    type: String,
    required: [true, 'Uma senha deve ser informada para o novo usuário.'],
    min: [configuracoes.seguranca.compimentoMinimoSenha || 6, `A senha deve ter no mínimo ${configuracoes.seguranca.compimentoMinimoSenha || 6} caracteres.`]
  },
  tipo: {type: String, required: true, defauld: 'local', enum: ['local', 'facebook', 'google']}
})

schemaUsuario.methods.gerarSenha = function (senha, callback) {
  bcrypt.hash(senha, configuracoes.seguranca.saltRounds || 10, function (err, hash) {
    if (err) {
      console.log(err)
      return callback(err, null)
    }
    return callback(null, hash)
  })
}
schemaUsuario.methods.compararSenha = function (senha, hash, callback) {
  bcrypt.compare(senha, hash, function (err, res) {
    if (err) {
      console.log(err)
      return callback(null, res)
    }
    return callback(null, res)
  })
}

module.exports = mongoose.model('Usuario', schemaUsuario)
