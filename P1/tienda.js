const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 8081;

const server = http.createServer((req, res) => {

    console.log("Recibido");

    let q = url.parse(req.url, true);
    console.log("Recurso solicitado (URL):" + req.url);
    console.log("Recurso:" + q.pathname);

    let fichero = "";
            
    if (q.pathname == "/")
        fichero += "index.html";  //--Página principal
    else{
        fichero = q.pathname; //-- q.pathname es otro recurso que se pide en el localhost
    }

    //-- Para sacar el tipo de fichero
    type_file = fichero.split(".")[1]; //--Se coge la extensión del archivo
    fichero = "." + "/ContenidoTienda" + fichero;
        console.log(fichero);


    fs.readFile (fichero, 'utf8', (err, data) => {

        if (err) {  //-- Ha ocurrido algun error
             console.log("Error!!");

            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        
        } else {  //-- Lectura normal
        
            console.log("Lectura correcta");

            let mime = "text/html";
            
            //Tipo de imágenes
            if (type_file == "png" || type_file == "jpg") {
                mime = "image/" + type_file;
            }
        
            // CSS
            if (type_file == "css"){
                mime = "text/css";
            }
            console.log(mime);
            //-- Generar el mensaje de respuesta
            res.writeHead(200, {'Content-Type': mime});
            res.write(data);
            res.end();
        }
    });
});

server.listen(PUERTO);
console.log ("Servidor 5 Happy activado, en el puerto " + PUERTO);