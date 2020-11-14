var http = require('http')
const axios = require('axios');


var servidor = http.createServer(function(req,res) {
    if(req.method == 'GET'){

        if(req.url == '/'){
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            res.write('<h2 style="padding-top:20px; text-align:center;">Escola de Música</h2>');
            res.write('<ul>');
            res.write('<li style="padding:5px;"> <a href="http://localhost:3001/alunos">Lista de alunos</a> </li>');
            res.write('<li style="padding:5px;"> <a href="http://localhost:3001/cursos">Lista de cursos</a> </li>');
            res.write('<li style="padding:5px;"> <a href="http://localhost:3001/instrumentos">Lista de instrumentos</a> </li>');
            res.write('</ul>'); 
        }

        else if (req.url.match(/\/[a-z]+$/)){
            
            var area = req.url.split("/")[1]

            console.log('area: ' + area);

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            var site = "http://localhost:3000/" + area
            axios.get(site)
                .then(resp => {
                    info = resp.data;
                    res.write(`<h2 style="padding-top:20px; text-align:center;">Lista de ${area}</h2>`);
                    res.write('<ul>');
                    info.forEach(a => {
                        if(area==="alunos") res.write(`<li style="padding:5px;"> <a href="http://localhost:3001/alunos/${a.id}">${a.id}, ${a.nome}</a></li>`);
                        if(area==="cursos") res.write(`<li style="padding:5px;"> <a href="http://localhost:3001/cursos/${a.id}">${a.id}, ${a.designacao}</a></li>`);
                        if(area==="instrumentos") res.write(`<li style="padding:5px;"> <a href="http://localhost:3001/instrumentos/${a.id}">${a.id}, ${a["#text"]}</a></li>`);
                    });

                    res.write('</ul>');
                    res.end();
                    
                }).catch(error => {
                    console.log('ERRO: ' + error);
                    res.write(`<p> Não se conseguiu obter a lista de ${area}</p>`);
                    res.end();
            })
        }

        
        else if (req.url.match(/\/[a-z]+\/[a-zA-Z0-9]+$/)){
            
            var area = req.url.split("/")[1]
            var id = req.url.split("/")[2]

            console.log('area: ' + area + ', id: ' + id);

            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })
            var site = "http://localhost:3000/" + area + "/" + id
            axios.get(site)
                .then(resp => {
                    info = resp.data;
                    if(area==="alunos"){
                        res.write(`<h2 style="padding-top:20px; text-align:center;">Aluno ${id}</h2>`);
                        res.write('<ul>');
                        res.write(`<li style="padding:5px;"><b>Nome:</b> ${info.nome}</li>`);
                        res.write(`<li style="padding:5px;"><b>Data nascimento:</b> ${info.dataNasc}</li>`);
                        res.write(`<li style="padding:5px;"><b>Curso:</b> <a href="http://localhost:3001/cursos/${info.curso}">${info.curso}</a></li>`);
                        res.write(`<li style="padding:5px;"><b>Ano do curso:</b> ${info.anoCurso}</li>`);
                        res.write(`<li style="padding:5px;"><b>Instrumento:</b> ${info.instrumento}</li>`);
                        res.write('</ul>');
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/alunos" style="color:purple;">Lista de alunos.</a>]</address>`);
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/" style="color:purple;">Voltar ao início.</a>]</address>`);
                        res.end();
                    }
                    if(area==="cursos"){
                        res.write(`<h2 style="padding-top:20px; text-align:center;">Curso ${id}</h2>`);
                        res.write('<ul>');
                        res.write(`<li style="padding:5px;"><b>Designação:</b> ${info.designacao}</li>`);
                        res.write(`<li style="padding:5px;"><b>Duração:</b> ${info.duracao}</li>`);
                        res.write(`<li style="padding:5px;"><b>Instrumento:</b> <a href="http://localhost:3001/instrumentos/${info.instrumento.id}">${info.instrumento["#text"]}</a></li>`);
                        res.write('</ul>');
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/cursos" style="color:purple;">Lista de cursos.</a>]</address>`);
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/" style="color:purple;">Voltar ao início.</a>]</address>`);
                        res.end();
                    }
                    if(area==="instrumentos"){
                        res.write(`<h2 style="padding-top:20px; text-align:center;">Instrumento ${id}</h2>`);
                        res.write('<ul>');
                        res.write(`<li style="padding:5px;"><b>Nome:</b> ${info["#text"]}</li>`);
                        res.write('</ul>');
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/instrumentos" style="color:purple;">Lista de instrumentos.</a>]</address>`);
                        res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/" style="color:purple;">Voltar ao início.</a>]</address>`);
                        res.end();
                    }
                    
                }).catch(error => {
                    console.log('ERRO: ' + error);
                    res.write(`<p>${id} inexistente em ${area}</p>`);
                    res.write(`<address style="padding-left:20px; padding-top:5px;">[<a href="http://localhost:3001/${area}" style="color:purple;">Lista de ${area}.</a>]</address>`);
                    res.end();
            })
        }
    }

    else{
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.write('<p>Pedido não suportado: ' + req.method + '</p>');
        res.end();
    }
})


servidor.listen(3001);
console.log('Servidor à escuta na porta 3001...')