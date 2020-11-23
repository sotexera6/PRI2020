var http = require('http')
var axios = require('axios')
var fs = require('fs')

var static = require('./public/static')

var {parse} = require('querystring')

var idTarefa = 0
var idMissing = 1

var tarefaInserida = 0

// Funções auxilidares
function recuperaInfo(request, callback){
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded'){
        let body = `id=${idTarefa}&`
        request.on('data', bloco =>{
            body += bloco.toString()
        })
        request.on('end', ()=>{
            console.log(body)
            callback(parse(body))
        })
    }
}

// Gera a página HTML
function geraPaginaHTML(res){
    axios.get(`http://localhost:3000/tarefas?estado=pendente&_sort=dataLimite,responsavel`)
        .then(response =>{
            var pendentes = response.data

            axios.get(`http://localhost:3000/tarefas?estado=terminado&estado=cancelado&_sort=dataLimite,responsavel`)
            .then(response =>{
                var feitas = response.data
                
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write(geraNovaTarefa())
                res.write(geraTarefasPendentes(pendentes))
                res.write(geraTarefasFeitas(feitas))
                res.end()

                if(Boolean(idMissing)){
                    idTarefa++
                    idMissing = 0
                }
            })
            .catch(function(erro){
                res.write("<p>Não foi possível obter a lista de tarefas terminadas/canceladas...</p>")
            })
        })
        .catch(function(erro){
            res.write("<p>Não foi possível obter a lista de tarefas pendentes...</p>")
        })
}

// Formulário nova tarefa
function geraNovaTarefa(){
    let pagHTML = `
    <html>
        <head>
            <title>Lista de Tarefas</title>
            <meta charset="utf-8"/>
            <link rel="icon" href="favicon.png"/>
            <link rel="stylesheet" href="../w3.css"/>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>Nova Tarefa</h2>
            </div>
            <form class="w3-container w3-margin-top" action="/" method="POST">
                <label class="w3-text-teal" required><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey w3-margin-bottom w3-round" type="text" name="descricao">

                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey w3-margin-bottom w3-round" type="text" name="responsavel">

                <label class="w3-text-teal" required><b>Data Limite</b></label>
                <input class="w3-input w3-border w3-light-grey w3-margin-bottom w3-round" type="text" name="dataLimite">

                <label class="w3-text-teal" required><b>Estado</b></label>
                <select class="w3-select w3-border w3-light-grey w3-margin-bottom w3-round" name="estado">
                    <option value="pendente">Pendente</option>
                    <option value="terminada">Terminado</option>
                    <option value="cancelada">Cancelado</option>
                </select>

                <input class="w3-button w3-blue-grey w3-margin-bottom w3-hover-teal w3-round" type="submit" value="Registar"/>
                <input class="w3-button w3-blue-grey w3-margin-bottom w3-margin-right w3-hover-teal w3-round" type="reset" value="Limpar"/>
    `
    if(tarefaInserida)
        pagHTML += '<address><a href="http://localhost:7777/">- Tarefa Inserida -</a></address>'

    pagHTML += ' </form>'

    return pagHTML
}

// Tabela tarefas pendentes
function geraTarefasPendentes(tarefas){
    let pagHTML =  `
        <div class="w3-container w3-teal">
            <h2>Tarefas Pendentes</h2>
        </div>

        <table class="w3-table w3-bordered w3-margin-bottom">
            <tr>
                <th width="20%" class="w3-text-teal">Data Limite</th>
                <th width="25%" class="w3-text-teal">Responsável</th>
                <th width="45%" class="w3-text-teal">Descrição</th>
                <th/>
            </tr>
    `

    tarefas.forEach(t => {

        pagHTML += 
        `
        <tr>
            <td class="w3-padding-16">${t.dataLimite}</td> 
            <td class="w3-padding-16">${t.responsavel}</td>
            <td class="w3-padding-16">${t.descricao}</td>
            <td>
            <button class="w3-button w3-round-large w3-text-teal w3-hover-green"><a href="http://localhost:7777/terminar/${t.id}"><i class="fa fa-check"></i></a></button>
            <button class="w3-button w3-round-large w3-text-teal w3-hover-red"><a href="http://localhost:7777/cancelar/${t.id}"><i class="fa fa-close"></i></a></button>
            </td>
        </tr>
        `

        if(Boolean(idMissing))
            if(Number(t.id) > idTarefa)
                idTarefa = Number(t.id)
    })

    pagHTML += `
        </table>
    `
    return pagHTML
}

// Tabela tarefas terminadas
function geraTarefasFeitas(tarefas){
    let pagHTML =  `
        <div class="w3-container w3-teal">
            <h2>Tarefas Terminadas e Canceladas</h2>
        </div>

        <table class="w3-table w3-bordered w3-margin-bottom">
            <tr>
                <th width="20%" class="w3-text-teal">Data Limite</th>
                <th width="25%" class="w3-text-teal">Responsável</th>
                <th width="30%" class="w3-text-teal">Descrição</th>
                <th width="17%" class="w3-text-teal">Estado</th>
                <th/>
            </tr>
    `
    tarefas.forEach(t => 
        {
            pagHTML += 
            `
            <tr>
                <td>${t.dataLimite}</td> 
                <td>${t.responsavel}</td>
                <td>${t.descricao}</td>
                <td>${t.estado}</td>
                <td>
                    <address><a href="http://localhost:7777/limpar/${t.id}">Limpar</a></address>
                </td>
            </tr>
            `

            if(Boolean(idMissing))
                if(Number(t.id) > idTarefa)
                    idTarefa = Number(t.id)
        })

    pagHTML += `
            </table>
        </body>
    </html>
    `
    return pagHTML
}

// Criação do servidor

var galunoServer = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    // Tratamento do pedido
    // Testa se é um recurso estático
    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else{
        switch(req.method){
            case "GET":
                tarefaInserida = 0

                if((req.url == "/") || (req.url == "/tarefas"))
                    geraPaginaHTML(res)   

                else if((/\/cancelar\/[0-9]+/).test(req.url)){
                    var tarefa = req.url.split("/")[2]
                    console.log('PUT da tarefa: ' + tarefa)

                    axios.get(`http://localhost:3000/tarefas/${tarefa}`)
                        .then(response =>{
                            var t = response.data
                            try{
                                axios.put(`http://localhost:3000/tarefas/${tarefa}`, {
                                    id : t.id,
                                    descricao : t.descricao,
                                    responsavel : t.responsavel,
                                    dataLimite : t.dataLimite,
                                    estado : "cancelado"
                                })
                                geraPaginaHTML(res)
                            }
                            catch(error){
                                res.write('<p>Erro no PUT: ' + error + '</p>')
                                console.log('ERRO no PUT' + error)
                            }
                        })
                        .catch(function(erro){
                            res.write(`<p>Não foi possível obter a tarefa ${tarefa}...</p>`)
                        })
                }

                else if((/\/limpar\/[0-9]+/).test(req.url)){
                    var tarefa = req.url.split("/")[2]
                    console.log('DELETE da tarefa: ' + tarefa)

                    try{
                        axios.delete(`http://localhost:3000/tarefas/${tarefa}`)
                    }
                    catch(error){
                        res.write('<p>Erro no DELETE: ' + error + '</p>')
                        console.log('ERRO no DELETE' + error)
                    }
                    geraPaginaHTML(res)
                }
                else if((/\/terminar\/[0-9]+/).test(req.url)){
                    var tarefa = req.url.split("/")[2]
                    console.log('PUT da tarefa: ' + tarefa)

                    axios.get(`http://localhost:3000/tarefas/${tarefa}`)
                        .then(response =>{
                            var t = response.data
                            try{
                                axios.put(`http://localhost:3000/tarefas/${tarefa}`, {
                                    id : t.id,
                                    descricao : t.descricao,
                                    responsavel : t.responsavel,
                                    dataLimite : t.dataLimite,
                                    estado : "terminado"
                                })
                                geraPaginaHTML(res)
                            }
                            catch(error){
                                res.write('<p>Erro no PUT: ' + error + '</p>')
                                console.log('ERRO no PUT' + error)
                            }
                        })
                        .catch(function(erro){
                            res.write(`<p>Não foi possível obter a tarefa ${tarefa}...</p>`)
                        })
                }

                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break

            case "POST":
                if (req.url=='/'){
                    tarefaInserida = 1
                    recuperaInfo(req, info=>{
                        console.log('POST de nova tarefa: ' + JSON.stringify(info))
                        axios.post('http://localhost:3000/tarefas', info)
                            .then(resp=>{
                                geraPaginaHTML(res)
                                idTarefa++;
                            })
                            .catch(erro=>{
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                    })
                }

                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p> POST " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                
                break
                
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
            }
    }
})

galunoServer.listen(7777)
console.log('Servidor à escuta na porta 7777...')