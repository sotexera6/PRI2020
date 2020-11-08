var http = require('http')
var fs = require('fs')

var servidor = http.createServer(function(req,res){
    if(req.url.match(/\/arqs\/[1-9][0-9]*$/)){
        var num = req.url.split("/")[2]

        fs.readFile('arqweb/arq' + num + '.html', function(err,data){
            if(err){
                console.log('ERRO na leitura do ficheiro: ' + err)
                res.writeHead(200, {'Content-Type':'text/html'})
                res.write("<p>Falha no ficheiro.</p>")
                res.end()
            }
        
            else{               
                res.writeHead(200, {'Content-Type':'text/html'})
                res.write(data)
                res.end()
            }
        }) 

    }
    else{
        if(req.url.match(/\/arqs\/\*$/)){
            fs.readFile('index.html', function(err,data){
                if(err){
                    console.log('ERRO na leitura do indice: ' + err)
                    res.writeHead(200, {'Content-Type':'text/html'})
                    res.write("<p>Falha no índice.</p>")
                    res.end()
                }
            
                else{               
                    res.writeHead(200, {'Content-Type':'text/html'})
                    res.write(data)
                    res.end()
                }
            }) 
        }

        else{
            console.log('ERRO foi pedido um ficheiro nao esperado!')
            res.writeHead(200, {'Content-Type':'text/html'})
            res.write('<p>Pedido errado.</p>')
            res.end()
        }
    }
    
})

servidor.listen(7777)

console.log('Servidor à escuta na porta 7777...')
