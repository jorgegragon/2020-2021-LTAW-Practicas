const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 8080;

const server = http.createServer((req, res) => {

    console.log("Recibido");

    let cap = url.parse(req.url, true);
    console.log("Recurso:" + cap.pathname);

    let fichero = "";
            
    if (cap.pathname == "/"){
        fichero += "/index.html";  //--Página principal
    } else {       
        fichero = cap.pathname; //-- q.pathname es otro recurso que se pide en el localhost
    }

        //-- Para sacar el tipo de fichero
    type_file = fichero.split(".")[1]; //--Se coge la extensión del archivo
    fichero = "." + "/ContenidoTienda" + fichero;
    //console.log(type_file);
    
    let mime = "";
    switch (type_file) {
      case "jpg":
        mime = "imagen/jpg";
        break;
      case "png":
        mime = "imagen/png";
        break;
      case "html":
        mime = "text/html";
        break;
      case "css":
        mime = "text/css";
        break;
      case "json":
        mime = "application/json";
        break;
      case "js":
        mime = "application/javascript";
        break;
      default:
        mime = "text/html";
    }


    fs.readFile (fichero, function(err, data) {

        if (err) {  //-- Ha ocurrido algun error
             console.log("Error!!");

            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        
        } else {  //-- Lectura normal
        
            console.log("Lectura correcta");

            //-- Generar el mensaje de respuesta
            res.writeHead(200, {'Content-Type': mime});
            res.write(data);
            res.end();
            console.log("---------Final ciclo----------");
        }
    });
});

server.listen(PUERTO);
console.log ("Servidor Tienda, en el puerto " + PUERTO);