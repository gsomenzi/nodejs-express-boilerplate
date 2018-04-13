const configuracao = require('../../config.json')
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  if (token) {
    jwt.verify(token, configuracao.seguranca.segredoToken, function (err, decoded) {
      if (err) {
        let err = new Error('Falha ao autenticar o token.')
        err.code = 'ACESSO_TOKEN_INVALIDO'
        return next({erro: err, status: 401})
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    let err = new Error('Nenhum token informado.')
    err.code = 'ACESSO_TOKEN_NAO_INFORMADO'
    return next({erro: err, status: 401})
  }
}
