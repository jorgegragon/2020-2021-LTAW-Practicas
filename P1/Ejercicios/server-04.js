const http = require('http')

const PUERTO = 8080;


const server = http.createServer((req, res) => {

    console.log ("Peticion recibida 4");
    res.write ("Soy el happy server \n");

    res.end();
});

server.listen(PUERTO);

console.log ("Servidor 4 Happy activado, en el puerto " + PUERTO);