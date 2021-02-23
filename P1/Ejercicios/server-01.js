const http = require('http')

const server = http.createServer();

function atender(req, res){
    console.log("Petición recibida");
}

server.on('request', atender);

server.listen(8080);