var Aluno = require('../models/aluno')

// Devolve a lista de alunos
module.exports.listar = () => {
    return Aluno 
        .find({}, function(err, result){
          //  console.log(result);
         })
        .exec()
}

module.exports.consultar = id => {
    return Aluno
        .findOne({Número : id}, function(err, result){
            console.log("GET: " + result);
         })
        .exec()
}

module.exports.inserir = a => {
    var novo = new Aluno(a)
    return novo.save()
}

module.exports.atualizar = a => {
    return Aluno.updateOne({"Número": a.Número},{"$set": {"Número": a.Número, "Nome":a.Nome, "Git":a.Git, "tpc":a.tpc}})
}

module.exports.eliminar = a => {
    return Aluno.deleteOne({"Número": a.Número})
}

