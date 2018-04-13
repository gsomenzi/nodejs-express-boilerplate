const Usuario = require('../modelos/usuario')
const camposBuscaPadrao = {
  dtCriado: 1,
  dtAtualizado: 1,
  nome: 1,
  usuario: 1,
  email: 1,
  tipo: 1
}

module.exports = {
  buscarUsuarios: buscarUsuarios,
  buscarUsuarioPorId: buscarUsuarioPorId,
  adicionarUsuarioLocal: adicionarUsuarioLocal,
  atualizarUsuario: atualizarUsuario,
  removerUsuario: removerUsuario,
  validarNovoUsuario: validarNovoUsuario,
  validarObjAtualizacaoUsuario: validarObjAtualizacaoUsuario
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

function atualizarUsuario (id, obj, callback) {
  validarObjAtualizacaoUsuario(obj, (err, objValido) => {
    if (err) return callback(err, null)
    Usuario.update({_id: id}, {$set: objValido}).exec((err, update) => {
      if (err) return callback(err, null)
      buscarUsuarioPorId(id, (err, usuario) => {
        if (err) return callback(err, null)
        return callback(null, usuario)
      })
    })
  })
}

function removerUsuario (id, callback) {
  Usuario.remove({_id: id}).exec((err) => {
    if (err) return callback(err)
    return callback(null)
  })
}

function validarNovoUsuario (obj, callback) {
  if (typeof obj !== 'object') {
    let err = new Error('O usuário não foi informado no formato correto. Entre em contato com o administrador do sistema.')
    err.code = 'ADICIONAR_USUARIO_NAO_OBJETO'
    return callback(err)
  }
  if (!obj.senha || typeof obj.senha !== 'string') {
    let err = new Error('Uma senha deve ser informada para o novo usuário.')
    err.code = 'ADICIONAR_USUARIO_SENHA_NAO_INFORMADA'
    return callback(err)
  }
  Usuario.count({email: obj.email}).exec((err, count) => {
    if (err) return callback(err)
    if (count) {
      let err = new Error('O endereço de e-mail já está em uso.')
      err.code = 'ADICIONAR_USUARIO_EMAIL_EM_USO'
      return callback(err)
    }
    Usuario.count({usuario: obj.usuario}).exec((err, count) => {
      if (err) return callback(err)
      if (count) {
        let err = new Error('O nome de usuário já está em uso.')
        err.code = 'ADICIONAR_USUARIO_USUARIO_EM_USO'
        return callback(err)
      }
      obj.dtCriado = new Date()
      obj.dtAtualizado = new Date()
      return callback(null, obj)
    })
  })
}

function validarObjAtualizacaoUsuario (obj, callback) {
  if (typeof obj !== 'object') {
    let err = new Error('O usuário não pode ser atualizado pois não foi possível identificar os campos para atualização.')
    err.code = 'ATUALIZAR_USUARIO_NAO_OBJETO'
    return callback(err)
  }
  let objValido = {}
  if (obj._id) delete obj._id
  if (obj.nome && typeof obj.nome === 'string') objValido.nome = obj.nome
  if (obj.usuario && typeof obj.usuario === 'string') objValido.usuario = obj.usuario
  if (JSON.stringify(objValido) !== '{}') objValido.dtAtualizado = new Date()
  callback(null, objValido)
}
