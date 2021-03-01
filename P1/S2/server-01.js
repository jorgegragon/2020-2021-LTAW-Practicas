const http = require('http')

const PUERTO = 8080;


const server = http.createServer((req, res) => {

    console.log ("Peticion recibida 3");

});

server.listen(PUERTO);

console.log ("Servidor 3 activado, en el puerto " + PUERTO);