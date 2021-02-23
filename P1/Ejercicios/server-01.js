const http = require('http')

const PUERTO = 8080;


function atender(req, res){
    console.log("Petición recibida");
}

const server = http.createServer(atender);

server.listen(PUERTO);

console.log ("Servidor 2 activado, en el puerto " + PUERTO);