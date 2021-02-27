const http = require('http')

const PUERTO = 8080;

const server = http.createServer((req, res) => {

    console.log("OK");

    res.setHeader('Content-Type', 'text/plain');

    res.write ("Soy el happy server \n");

    res.end();
});

server.listen(PUERTO);

console.log ("Servidor 5 Happy activado, en el puerto " + PUERTO);