const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schemaUsuario = new Schema({
  nome: {type: String, required: true},
  usuario: {type: String, required: true, index: {unique: true}},
  email: {type: String, required: true, index: {unique: true}},
  senha: {type: String, required: true},
  tipo: {type: String, required: true, defauld: 'local', enum: ['local', 'facebook', 'google']}
})

module.exports = mongoose.model('Usuario', schemaUsuario)
