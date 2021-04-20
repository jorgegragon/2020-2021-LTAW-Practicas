//-- Imprimir información sobre la solicitud recibida

const http = require('http');
const fs = require('fs');
const PUERTO = 8080;

//-- Cargar pagina web del formulario
const PRINCIPAL = fs.readFileSync('index.html','utf-8');
const FORMULARIO = fs.readFileSync('formulario.html','utf-8');
const PEDIDO = fs.readFileSync('carro.html','utf-8');

//-- HTML de la página de respuesta
const RESPUESTA = fs.readFileSync('correcto.html', 'utf-8');
const Error = fs.readFileSync('error.html', 'utf-8');

//-- Fichero JSON
const FICHERO_JSON = "registro.json";
const tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);

function get_user(req) {

  //-- Leer la Cookie recibida
  const cookie = req.headers.cookie;

  //-- Hay cookie
  if (cookie) {
    
    //-- Obtener un array con todos los pares nombre-valor
    let pares = cookie.split(";");
    
    //-- Variable para guardar el usuario
    let user;

    //-- Recorrer todos los pares nombre-valor
    pares.forEach((element, index) => {

      //-- Obtener los nombres y valores por separado
      let [nombre, valor] = element.split('=');

      //-- Leer el usuario
      //-- Solo si el nombre es 'user'
      if (nombre.trim() === 'user') {
        user = valor;
      }
    });

    //-- Si la variable user no está asignada
    //-- se devuelve null
    return user || null;
  }
}

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
  let content = PRINCIPAL;
  let registrado = 0;

  let user = get_user(req);
  console.log("User: " + user);

  if (myURL.pathname == '/') {

    //--- Si la variable user está asignada
    if (user) {

      content = RESPUESTA.replace("HTML_EXTRA", `<a href="login">[Login]</a>`);
        //-- Añadir a la página el nombre del usuario
    }
  }

  if (myURL.pathname == '/formulario') {
    content = FORMULARIO;
  }

  if (myURL.pathname == '/carro') {
    content = PEDIDO;
  }

  if (myURL.pathname == '/pedido') {
    content = PRINCIPAL;
    var direccion = myURL.searchParams.get('direccion');
    var tarjeta = myURL.searchParams.get('tarjeta');

    tienda[0]["direccion"] = direccion;
    tienda[0]["tarjeta"] = tarjeta;
    
    let myJSON = JSON.stringify(tienda);
//-- Guardarla en el fichero destino
    fs.writeFileSync(FICHERO_JSON, myJSON); 
  }
  
  if (myURL.pathname == '/procesar') {
      content_type = "text/html";
      user = myURL.searchParams.get('nombre');
      console.log(user);
      
      tienda.forEach((element, index)=>{
        if (element["nombre"] == user){
            registrado += 1;
        }
      });
      
      if (registrado != 0) {
        content = RESPUESTA;
        res.setHeader('Set-Cookie', "user=" + user);
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