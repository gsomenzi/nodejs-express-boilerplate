module.exports = function (router) {
  router.get('/', function (req, res) {
    res.json({ message: 'Bem vindo a API!' })
  })
}
