var http = require('http')
var axios = require('axios')

http.createServer(function (req, res) {
    console.log(req.method + ' ' + req.url)
    if(req.method == 'GET'){
        if(req.url == '/'){
            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
            res.write('<h2>Escola de Música</h2>')
            res.write('<ul>')
            res.write('<li><a href="/alunos">Lista de alunos</a></li>')
            res.write('<li><a href="/cursos">Lista de Cursos</a></li>')
            res.write('<li><a href="/instrumentos">Lista de instrumentos</a></li>')
            res.write('</ul>')
            res.end()
        }
        else if(req.url == '/alunos'){
            axios.get('http://localhost:3000/alunos')
            .then(function (resp) {
                alunos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Alunos</h2>')
                res.write('<ul>')
            
                alunos.forEach(a => {
                    res.write('<li><a href="/alunos/' + a.id + '">' + a.nome + '</a></li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            }); 
        }
        else if(req.url.match(/\/alunos\/A([0-9]+)$/)) {
            var idAluno = req.url.split("/")[2]
            axios.get('http://localhost:3000/alunos/'+idAluno)
            .then(function (resp) {
                aluno = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Informação do aluno ' + aluno.nome + '</h2>')
                res.write('<p> ID do aluno: ' + aluno.id + '</p>')
                res.write('<p> Nome do aluno: ' + aluno.nome + '</p>')
                res.write('<p> Data de nascimento do aluno: ' + aluno.dataNasc + '</p>')
                res.write('<p> Curso do aluno: ' + aluno.curso + '</p>')
                res.write('<p> Ano do curso do aluno: ' + aluno.anoCurso + '</p>')
                res.write('<p> Instrumento do aluno: ' + aluno.instrumento + '</p>')
            
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            });
        }
        else if(req.url == '/cursos') {
            axios.get('http://localhost:3000/cursos')
            .then(function (resp) {
                cursos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Cursos</h2>')
                res.write('<ul>')
            
                cursos.forEach(a => {
                    res.write('<li><a href="/cursos/' + a.id + '">' + a.designacao + '</a></li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            });
        }
        else if(req.url.match(/\/cursos\/C((S|B)[0-9]+)$/)) {
            var idCurso = req.url.split("/")[2]
            axios.get('http://localhost:3000/cursos/'+idCurso)
            .then(function (resp) {
                curso = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Informação do curso ' + curso.designacao + '</h2>')
                res.write('<p> ID do curs: ' + curso.id + '</p>')
                res.write('<p> Nome do curso: ' + curso.designacao + '</p>')
                res.write('<p> Duração do curso: ' + curso.duracao + '</p>')
                res.write('<p> Instrumento do curso: ' + curso.instrumento.id + '</p>')
            
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de cursos: ' + error);
            });
        }
        else if(req.url == '/instrumentos') {
            axios.get('http://localhost:3000/instrumentos')
            .then(function (resp) {
                instrumentos = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Lista de Instrumentos</h2>')
                res.write('<ul>')
            
                instrumentos.forEach(a => {
                    res.write('<li><a href="/instrumentos/' + a.id + '">' + a.text + '</a></li>')
                });

                res.write('</ul>')
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de alunos: ' + error);
            });
        }
        else if(req.url.match(/\/instrumentos\/I([0-9]+)$/)) {
            var idInstrumento = req.url.split("/")[2]
            axios.get('http://localhost:3000/instrumentos/'+idInstrumento)
            .then(function (resp) {
                instrumento = resp.data;
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write('<h2>Escola de Música: Informação do curso ' + instrumento.id+ '</h2>')
                res.write('<p> ID do instrumento: ' + instrumento.id + '</p>')
                res.write('<p> Nome do instrumento: ' + instrumento.text + '</p>')
            
                res.write('<address>[<a href="/">Voltar</a>]</address>')
                res.end()
            })
            .catch(function (error)  {
                console.log('Erro na obtenção da lista de cursos: ' + error);
            });
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'})
            res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
            res.end() 
        }
    }
    else{
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write("<p>Pedido não suportado: " + req.method + " " + req.url + "</p>")
        res.end()
    }
    
}).listen(4000)

console.log('Servidor Ã  escuta na porta 4000...')