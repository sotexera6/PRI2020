var express = require('express');
var router = express.Router();
var methodOverride = require("method-override");

const Aluno = require('../controllers/aluno')
const stringify = require("json-stringify-pretty-compact");

router.use(methodOverride("_method"))

/* GET */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Turma PRI de 2020' });
});

router.get('/alunos', (req, res) => {
  Aluno.listar()
    .then(dados => res.render('pagina', {lista: dados, metodo: "alunos"}))
    .catch(e => res.render('error', {erros: e}))
})

router.get('/alunos/registar', (req, res) => {
  res.render('pagina', {metodo: "registar"})
})

router.get('/alunos/editar/:id', (req, res) => {
  Aluno.consultar(req.params.id)
    .then(a => res.render('pagina', {aluno: a, metodo:"editar"}))
    .catch(e => res.render('error', {erros: e}))
})

router.get('/alunos/:id', (req, res) => {
  Aluno.consultar(req.params.id)
    .then(a => res.render('pagina', {aluno: a, metodo:"aluno"}))
    .catch(e => res.render('error', {erros: e}))
})

router.get('/:smth', function(req, res) {
  res.render('index', { title: 'Página inexistente'});
})

/* PUT */
router.put('/alunos', (req, res) => {
  //array tpcs
  var tps = []
  if(req.body.tpc){
    for (var tpi = 1; tpi <= 8; tpi++) {
      if (stringify(req.body.tpc, null, 2).includes(tpi)) tps.push(1)
      else tps.push(0)
    }
  }
  else
    for (var tpi = 1; tpi <= 8; tpi++)
      tps.push(0)
  
  req.body.tpc = tps.slice()
  
  //atualizar
  console.log('UPDATE: ' + stringify(req.body, null, 2))

  Aluno.atualizar(req.body)
    .then(res.render('pagina', {aluno: req.body, metodo: "aluno"}))
    .catch(e => res.render('error', {erros: e}))
})

/* POST */
router.post('/alunos', (req, res) => {
  //array tpcs
  var tps = []
  if(req.body.tpc){
    for (var tpi = 1; tpi <= 8; tpi++) {
      if (stringify(req.body.tpc).includes(tpi)) tps.push(1)
      else tps.push(0)
    }
  }
  else
    for (var tpi = 1; tpi <= 8; tpi++)
      tps.push(0)
  
  req.body.tpc = tps.slice()
  
  //inserir
  console.log('POST: ' + stringify(req.body, null, 2))

  Aluno.inserir(req.body)
    .then(dados => res.render('pagina', {aluno: dados, metodo:"aluno"}))
    .catch(e => res.render('error', {erros: e}))
})

/* DELETE */
router.delete('/alunos', (req, res) => {

  console.log('DELETE: ' + stringify(req.body, null, 2))

  Aluno.eliminar(req.body)
    .then(
      Aluno.consultar(req.body.Número)
        .then(a => res.render('pagina', {aluno: a, metodo:"eliminar"}))
        .catch(e => res.render('error', {erros: e}))
      )
    .catch(e => res.render('error', {erros: e}))
})



module.exports = router;

