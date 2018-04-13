module.exports = (function () {
  return function errorHandler (err, req, res, next) {
    console.log(err)
    if ((err instanceof Error) || (err instanceof TypeError)) {
      return res.status(500).json({
        status: 'erro',
        codigo: err.code,
        mensagem: err.message
      })
    } else {
      if (err.status || !isNaN(err.status)) {
        return res.status(err.status).json({
          status: 'erro',
          codigo: err.erro.code,
          mensagem: err.erro.message
        })
      }
      return res.status(500).json(err.erro)
    }
  }
})()
