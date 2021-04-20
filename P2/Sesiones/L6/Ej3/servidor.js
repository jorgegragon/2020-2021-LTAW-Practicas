//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 8080;

//-- Cargar pagina web del formulario
const FORMULARIO = fs.readFileSync('formulario.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('correcto.html', 'utf-8');
const Error = fs.readFileSync('error.html', 'utf-8');

//-- Fichero JSON
const FICHERO_JSON = "registro.json";
const tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);


//-- SERVIDOR: Bucle principal de atención a clientes
const server = http.createServer((req, res) => {

  //-- Construir el objeto url con la url de la solicitud
  const myURL = new URL(req.url, 'http://' + req.headers['host']);  
  //console.log("");
  //console.log("Método: " + req.method);
  //console.log("Recurso: " + req.url);
  //console.log("  Ruta: " + myURL.pathname);
  //console.log("  Parametros: " + myURL.searchParams);

  //-- Por defecto entregar formulario
  let content_type = "text/html";
  let content = FORMULARIO;
  let registrado = 0;

  if (myURL.pathname == '/procesar') {
      content_type = "text/html";
      var user = myURL.searchParams.get('nombre');
      console.log(user);
      
      tienda.forEach((element, index)=>{
        if (element["nombre"] == user){
            registrado += 1;
        }
      });

      if (registrado != 0) {
        content = RESPUESTA;
      }else{
        content = Error;
      }
  }

  //-- Si hay datos en el cuerpo, se imprimen
  req.on('data', (cuerpo) => {

    //-- Los datos del cuerpo son caracteres
    req.setEncoding('utf8');
    console.log(`Cuerpo (${cuerpo.length} bytes)`)
    console.log(` ${cuerpo}`);
  });

  //-- Esto solo se ejecuta cuando llega el final del mensaje de solicitud
  req.on('end', ()=> {
    //-- Generar respuesta
    res.setHeader('Content-Type', content_type);
    res.write(content);
    res.end()
  });

});

server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);