const Usuario = require('../modelos/usuario')
const camposBuscaPadrao = {
  dtCriado: 1,
  dtAtualizado: 1,
  nome: 1,
  usuario: 1,
  email: 1,
  senha: 1,
  tipo: 1
}

module.exports = {
  validarNovoUsuario: validarNovoUsuario,
  adicionarUsuarioLocal: adicionarUsuarioLocal,
  buscarUsuarios: buscarUsuarios,
  buscarUsuarioPorId: buscarUsuarioPorId,
  removerUsuario: removerUsuario
}

function buscarUsuarioPorId (id, callback) {
  Usuario.findOne({_id: id}).select(camposBuscaPadrao).exec((err, usuario) => {
    if (err) return callback(err, null)
    return callback(null, usuario)
  })
}

function buscarUsuarios (callback) {
  Usuario.find().select(camposBuscaPadrao).exec((err, usuarios) => {
    if (err) return callback(err, null)
    return callback(null, usuarios)
  })
}

function removerUsuario (id, callback) {
  Usuario.remove({_id: id}).exec((err) => {
    if (err) return callback(err)
    return callback(null)
  })
}

function adicionarUsuarioLocal (obj, callback) {
  validarNovoUsuario(obj, (err, objValido) => {
    if (err) return callback(err, null)
    objValido.tipo = 'local'
    const usuarioModelo = new Usuario()
    usuarioModelo.gerarSenha(objValido.senha, (err, hash) => {
      if (err) return callback(err, null)
      objValido.senha = hash
      Usuario.create(objValido, (err, usuarioCriado) => {
        if (err) return callback(err, null)
        buscarUsuarioPorId(usuarioCriado._id, (err, usuario) => {
          if (err) return callback(err, null)
          return callback(null, usuario)
        })
      })
    })
  })
}

function validarNovoUsuario (obj, callback) {
  if (typeof obj !== 'object') return callback(new TypeError('O usuário não foi informado no formato correto. Entre em contato com o administrador do sistema.'))
  obj.dtCriado = new Date()
  obj.dtAtualizado = new Date()
  return callback(null, obj)
}
