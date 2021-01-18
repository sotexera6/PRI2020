var express = require('express');
var router = express.Router();
var axios = require('axios')

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:3000/alunos')
    .then(dados => res.render('index', {alunos: dados.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/aluno/:id', function(req, res, next) {
  axios.get('http://localhost:3000/alunos/'+ req.params.id)
    .then(a => res.render('aluno', {aluno: a.data}))
    .catch(e => res.render('error', {error: e}))
});

router.get('/curso/:id', function(req, res, next) {
  axios.get('http://localhost:3000/cursos/' + req.params.id)
    .then(dados => res.render('curso', {curso: dados.data, aluno: req.query.aluno}))
    .catch(e => res.render('error', {error: e}))
});

module.exports = router;
