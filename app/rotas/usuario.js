const UsuarioController = require('../controladores/usuario')

module.exports = function (routers) {
  // ROTAS PARA /usuarios
  routers.autenticado.route('/usuarios')
    .post(function (req, res, next) {
      UsuarioController.adicionarUsuarioLocal(req.body, (err, usuario) => {
        if (err) return next(err)
        return res.status(201).json(usuario)
      })
    })
    .get(function (req, res, next) {
      UsuarioController.buscarUsuarios((err, usuarios) => {
        if (err) return next(err)
        return res.status(200).json(usuarios)
      })
    })
  // ROTAS PARA /usuarios/idUsuario
  routers.autenticado.route('/usuarios/:idUsuario')
    .get(function (req, res, next) {
      UsuarioController.buscarUsuarioPorId(req.params.idUsuario, (err, usuario) => {
        if (err) return next(err)
        return res.status(200).json(usuario)
      })
    })
    .put(function (req, res, next) {
      UsuarioController.atualizarUsuario(req.params.idUsuario, req.body, (err, usuario) => {
        if (err) return next(err)
        return res.status(200).json(usuario)
      })
    })
    .delete(function (req, res, next) {
      UsuarioController.removerUsuario(req.params.idUsuario, (err) => {
        if (err) return next(err)
        return res.status(204).end()
      })
    })
}
