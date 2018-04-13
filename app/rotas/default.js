module.exports = function (routers) {
  routers.naoAutenticado.get('/', function (req, res) {
    res.json({ message: 'Bem vindo a API!' })
  })
}
