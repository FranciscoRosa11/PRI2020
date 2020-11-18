var http = require('http')
var axios = require('axios')
var fs = require('fs')

var {parse} = require('querystring')

function recuperaInfo(request, callback) {
    if(request.headers['content-type'] == 'application/x-www-form-urlencoded') {
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=> {
            console.log(body)
            callback(parse(body))
        })
    }
}

function geraPostConfirm(tarefa){
    return `
    <html>
    <head>
        <title>POST receipt: ${tarefa.descricao}</title>
        <meta charset="utf-8"/>
        <link rel="icon" href="favicon.png"/>
        <link rel="stylesheet" href="w3.css"/>
    </head>
    <body>
        <div class="w3-card-4">
            <header class="w3-container w3-teal">
                <h1>Tarefa "${tarefa.descricao}" inserida</h1>
            </header>

            <footer class="w3-container w3-teal">
                <address>Gerado por tarefasServer::PRI2020- [<a href="/tarefas">Voltar</a>]</address>
            </footer>
        </div>
    </body>
    </html>
    `
}

function geraFormTarefa(){
    return `
    <html>
        <head>
            <title>Registo de uma tarefa</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="../w3.css"/>
        </head>
        <body>
        
        </body>
            <div class="w3-container w3-teal">
                <h2>Registo de Tarefa</h2>
            </div>

            <form class="w3-container" action="/tarefas" method="POST">
                <label class="w3-text-teal"><b>Descrição</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="descricao">
          
                <label class="w3-text-teal"><b>Responsável</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="responsavel">

                <label class="w3-text-teal"><b>Data-Limite</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="datalimite">

                <label class="w3-text-teal"><b>Status</b></label>
                <input class="w3-input w3-border w3-light-grey" type="text" name="status" value="Pendente" readonly>
          
                <input class="w3-btn w3-blue-grey" type="submit" value="Registar"/>
                <input class="w3-btn w3-blue-grey" type="reset" value="Limpar valores"/> 
            </form>

            <footer class="w3-container w3-teal">
                <address>Gerado por tarefasServer::PRI2020</address>
            </footer>
        </body>
    </html>
    `
}

function geraPagResCancel(lista){
    let pagHTML = `
    <html>
        <head>
            <title>Lista de Tarefas concluídas/canceladas</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>
                    Lista de Tarefas concluídas/canceladas
                </h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th style="text-align:center">Id</th>
                    <th style="text-align:center">Descrição</th>
                    <th style="text-align:center">Responsável</th>
                    <th style="text-align:center">Data limite</th>
                    <th style="text-align:center">Status</th>
                    <th style="text-align:center">Recoisar tarefa</th>
                </tr>
  `
  lista.forEach(element => {
      if(element.status == "Resolvida" || element.status == "Cancelada") {
        pagHTML += `
        <tr>
            <td style="text-align:center">${element.id}</td>
            <td style="text-align:center">${element.descricao}</td>
            <td style="text-align:center">${element.responsavel}</td>
            <td style="text-align:center">${element.datalimite}</td>
            <td style="text-align:center">${element.status}</td>
            <td style="text-align:center">
                <form class="w3-container" action="/tarefas/${element.id}/devolver" method="POST"><input type=submit value="Recoisar" style="width:100%"></form>
            </td>
        </tr>
    `    
      }
    
  });

  pagHTML += `
        </table>
    </body>
    </html>
  `
  return pagHTML
  }

function geraPagTarefas(lista){
    let pagHTML = `
    <html>
        <head>
            <title>Lista de tarefas</title>
            <meta charset="utf-8"/>
            <link rel="stylesheet" href="w3.css"/>
        </head>
        <body>
            <div class="w3-container w3-teal">
                <h2>
                    Lista de Tarefas
                </h2>
            </div>
            <table class="w3-table w3-bordered">
                <tr>
                    <th style="text-align:center">Id</th>
                    <th style="text-align:center">Descrição</th>
                    <th style="text-align:center">Responsável</th>
                    <th style="text-align:center">Data limite</th>
                    <th style="text-align:center">Status</th>
                    <th style="text-align:center">Marcar como resolvida</th>
                    <th style="text-align:center">Cancelar</th>
                </tr>
  `
  lista.forEach(element => {
      if(element.status == "Pendente") {
        pagHTML += `
        <tr>
            <td style="text-align:center">${element.id}</td>
            <td style="text-align:center">${element.descricao}</td>
            <td style="text-align:center">${element.responsavel}</td>
            <td style="text-align:center">${element.datalimite}</td>
            <td style="text-align:center">${element.status}</td>
            <td style="text-align:center">
                <form class="w3-container" action="/tarefas/${element.id}/resolver" method="POST"><input type=submit value="Resolvida" style="width:100%"></form>
            </td>
            <td style="text-align:center">
                <form class="w3-container" action="/tarefas/${element.id}/cancelar" method="POST"><input type=submit value="Cancelar" style="width:100%"></form>
            </td>
        </tr>
    `  
      }  
  });

  pagHTML += `
        </table>
    </body>
    </html>
  `
  return pagHTML
  }

var tarefasServer = http.createServer(function(req, res) {
    switch(req.method) {
        case "GET":
            if((req.url=="/tarefas") || (req.url == "/")) {
                axios.get("http://localhost:3000/tarefas")
                    .then(response => {
                        var tarefas = response.data

                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write(geraFormTarefa())
                        res.write(geraPagTarefas(tarefas))
                        res.write(geraPagResCancel(tarefas))
                        res.end()
                    })
                    .catch(function(erro){
                        console.log(erro)
                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                        res.write("<p>Não foi possível obter a lista de tarefas...")
                        res.end()
                    })
            }
            else if(/w3.css$/.test(req.url)){
                fs.readFile("w3.css", function(erro, dados){
                    if(!erro){
                        res.writeHead(200, {'Content-Type': 'text/css;charset=utf-8'})
                        res.write(dados)
                        res.end()
                    }
                })
            }
            break
        case "POST": //o json se já tiver sido inicializado tem que ter um campo id, caso contrário ele coloca um campo id
            if(req.url == "/tarefas" || req.url == "/") {
                recuperaInfo(req, info => {
                    console.log('POST de tarefa: ' + JSON.stringify(info))
                    axios.post('http://localhost:3000/tarefas', info)
                        .then(resp => {
                            axios.get("http://localhost:3000/tarefas")
                                .then(response => {
                                    var tarefas = response.data

                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write(geraFormTarefa())
                                    res.write(geraPagTarefas(tarefas))
                                    res.write(geraPagResCancel(tarefas))
                                    res.end()
                                })
                                .catch(function(erro){
                                    console.log(erro)
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write("<p>Não foi possível obter a lista de tarefas...")
                                    res.end()
                                })
                        })
                        .catch(erro => {
                            console.log(erro)
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write('<p>ERRO NO POST/p>')
                            res.write('<p><a href="/">Voltar</a></p>')
                            res.end()
                        })
                })
            }
            else if(req.url.match(/\/tarefas\/([0-9]+)\/cancelar$/)) {
                var id = req.url.split("/")[2]
                axios.get("http://localhost:3000/tarefas/"+id)
                    .then(response => {
                        axios.put('http://localhost:3000/tarefas/'+id, {
                        "descricao": response.data.descricao,
                        "responsavel": response.data.responsavel,
                        "datalimite": response.data.datalimite,
                        "status": "Cancelada"
                    }).then(resp => {
                        axios.get("http://localhost:3000/tarefas")
                            .then(response => {
                                var tarefas = response.data

                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraFormTarefa())
                                res.write(geraPagTarefas(tarefas))
                                res.write(geraPagResCancel(tarefas))
                                res.end()
                            })
                            .catch(function(erro){
                                console.log(erro)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de tarefas...")
                                res.end()
                            })
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                    });
                })
            }
            else if(req.url.match(/\/tarefas\/([0-9]+)\/resolver$/)) {
                var id = req.url.split("/")[2]
                axios.get("http://localhost:3000/tarefas/"+id)
                    .then(response => {
                        axios.put('http://localhost:3000/tarefas/'+id, {
                        "descricao": response.data.descricao,
                        "responsavel": response.data.responsavel,
                        "datalimite": response.data.datalimite,
                        "status": "Resolvida"
                    }).then(resp => {
                        axios.get("http://localhost:3000/tarefas")
                            .then(response => {
                                var tarefas = response.data

                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraFormTarefa())
                                res.write(geraPagTarefas(tarefas))
                                res.write(geraPagResCancel(tarefas))
                                res.end()
                            })
                            .catch(function(erro){
                                console.log(erro)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de tarefas...")
                                res.end()
                            })
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                    });
                })
            }
            else if(req.url.match(/\/tarefas\/([0-9]+)\/devolver$/)) {
                var id = req.url.split("/")[2]
                axios.get("http://localhost:3000/tarefas/"+id)
                    .then(response => {
                        axios.put('http://localhost:3000/tarefas/'+id, {
                        "descricao": response.data.descricao,
                        "responsavel": response.data.responsavel,
                        "datalimite": response.data.datalimite,
                        "status": "Pendente"
                    }).then(resp => {
                        axios.get("http://localhost:3000/tarefas")
                            .then(response => {
                                var tarefas = response.data

                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write(geraFormTarefa())
                                res.write(geraPagTarefas(tarefas))
                                res.write(geraPagResCancel(tarefas))
                                res.end()
                            })
                            .catch(function(erro){
                                console.log(erro)
                                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                res.write("<p>Não foi possível obter a lista de tarefas...")
                                res.end()
                            })
                    })
                    .catch(error => {
                        console.log('ERRO: ' + error);
                    });
                })
            }
            else {
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p> POST" + req.url + " não suportado neste serviço.</p>")
                res.end()
            }
            break
        default: 
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write("<p>" + req.method + " não suportado neste serviço.</p>")
            res.end() 
    }
})

tarefasServer.listen(7777)