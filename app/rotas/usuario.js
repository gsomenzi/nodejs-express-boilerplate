const Usuario = require('../modelos/usuario')
const UsuarioController = require('../controladores/usuario')

module.exports = function (router) {
  // ROTAS PARA /usuarios
  router.route('/usuarios')
    .post(function (req, res) {
      UsuarioController.adicionarUsuarioLocal(req.body, (err, usuario) => {
        if (err) return res.send(err)
        return res.status(201).json(usuario)
      })
    })
    .get(function (req, res) {
      UsuarioController.buscarUsuarios((err, usuarios) => {
        if (err) return res.send(err)
        return res.status(200).json(usuarios)
      })
    })
  // ROTAS PARA /usuarios/idUsuario
  router.route('/usuarios/:idUsuario')
    .get(function (req, res) {
      UsuarioController.buscarUsuarioPorId(req.params.idUsuario, (err, usuario) => {
        if (err) return res.send(err)
        return res.status(200).json(usuario)
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
      UsuarioController.removerUsuario(req.params.idUsuario, (err) => {
        if (err) return res.send(err)
        return res.status(204).end()
      })
    })
}
