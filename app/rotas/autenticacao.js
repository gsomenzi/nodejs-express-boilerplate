const configuracao = require('../../config.json')
const Usuario = require('../modelos/usuario')
var jwt = require('jsonwebtoken')

module.exports = function (routers) {
  // ROTAS PARA /login
  routers.naoAutenticado.route('/login')
    .post(function (req, res, next) {
      if (!req.body.usuario && !req.body.email) {
        let err = new Error('Você deve informar o nome de usuário ou e-mail.')
        err.code = 'LOGIN_USUARIO_NAO_INFORMADO'
        return next({erro: err, status: 403})
      }
      if (!req.body.senha) {
        let err = new Error('Você deve informar a sua senha.')
        err.code = 'LOGIN_SENHA_NAO_INFORMADA'
        return next({erro: err, status: 403})
      }
      let query = {usuario: req.body.usuario}
      if (!req.body.usuario && req.body.email) query = {email: req.body.email}
      Usuario.findOne(query).exec(function (err, usuario) {
        if (err) return next(err)
        if (!usuario) {
          let err = new Error('Usuário ou senha incorretos.')
          err.code = 'LOGIN_INCORRETO'
          return next({erro: err, status: 403})
        }
        let modeloUsuario = new Usuario()
        modeloUsuario.compararSenha(req.body.senha, usuario.senha, (err, senhaValida) => {
          if (err) return next(err)
          if (!senhaValida) {
            let err = new Error('Usuário ou senha incorretos.')
            err.code = 'LOGIN_INCORRETO'
            return next({erro: err, status: 403})
          }
          const payload = {
            usuario: usuario.usuario,
            nome: usuario.nome,
            email: usuario.email
          }
          const token = jwt.sign(payload, configuracao.seguranca.segredoToken, {expiresIn: `${configuracao.seguranca.minutosExpiracaoToken}m`})
          res.status(200).json({
            status: 'sucesso',
            mensagem: 'Login efetuado com sucesso.',
            token: token
          })
        })
      })
    })
}
