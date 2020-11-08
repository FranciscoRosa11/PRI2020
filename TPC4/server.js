var http = require('http')
var url = require('url')
var fs = require('fs')

var servidor = http.createServer(function (req,res) {
    if(req.url.match(/\/([a-zA-Z]+)([0-9]+)$/)) {
        var numero = req.url.split("/")[1]
        console.log(numero)
        fs.readFile('site/'+ numero + '.html', function(err,data) {
            if(err) {
                console.log('ERRO NA LEITURA DE FICHEIRO: ' + err)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Ficheiro inexistente</p>")
                res.end()
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                res.end()
            }
        })
    }
    else if(req.url.match(/\/\*$/)) {
        fs.readFile('site/index.html', function(err,data) {
            if(err) {
                console.log('ERRO NA LEITURA DE FICHEIRO: ' + err)
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write("<p>Ficheiro inexistente</p>")
                res.end()
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html'})
                res.write(data)
                res.end()
            }
        })
    } 
    else {
        console.log('ERRO, FOI PEDIDO UM FICHEIRO NAO ESPERADO')
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write("<p>Ficheiro inexistente</p>")
        res.end()
    }
    
})

servidor.listen(7777);

console.log("ESCUTANDO");