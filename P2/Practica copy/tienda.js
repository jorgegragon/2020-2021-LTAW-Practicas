const http = require('http');
const url = require('url');
const fs = require('fs');

const PUERTO = 8080;

//-- Cambios
var PRINCIPAL = fs.readFileSync('./ContenidoTienda/index.html','utf-8');
var CARRO = fs.readFileSync('./ContenidoTienda/formulario/carro.html','utf-8');
var PAG_ERROR = fs.readFileSync('./ContenidoTienda/formulario/error.html','utf-8');
//-- Formularios
const pagina_inicio = "./ContenidoTienda/index.html";
const user_correcto = './ContenidoTienda/formulario/correcto.html';
const user_denegado = './ContenidoTienda/formulario/error.html';
const login = "./ContenidoTienda/formulario/formulario.html";
const carrito = './ContenidoTienda/formulario/carro.html';
const compra = './ContenidoTienda/formulario/compra.html';
const add_carro = "./ContenidoTienda/solicitud_compra";
const compra_correcta = "./ContenidoTienda/formulario/compra_correcta.html";
const compra_denegada = './ContenidoTienda/formulario/buy_error.html'

//-- Fichero JSON
const FICHERO_JSON = "./ContenidoTienda/formulario/registro.json";
const tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);
const tienda_user = tienda["Usuarios"];
const tienda_productos = tienda["Productos"];
const tienda_pedidos = tienda["Pedidos"];

//-- Buscar User
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

// -- Inicio servidor  

const server = http.createServer((req, res) => {

    //console.log("Recibido");
    const myURL = new URL(req.url, 'http://' + req.headers['host']);
    //console.log("Recurso:" + myURL.pathname);
    //console.log("Recurso:" + cap.pathname);
    let fichero = "";

    //-- Por defecto entregar la pagina principal
    let registrado = 0;

    let user = get_user(req);
    //console.log("User: " + user);

    if (myURL.pathname == '/') {
        fichero += "/index.html";
    }else{
        fichero = myURL.pathname; //-- q.pathname es otro recurso que se pide en el localhost
    }
            
    //-- Para sacar el tipo de fichero
    fichero = "." + "/ContenidoTienda" + fichero;
    type_file = fichero.split(".")[2]; //--Se coge la extensión del archivo


    if (fichero == './ContenidoTienda/procesar_user') {
        user = myURL.searchParams.get('nombre');
        
        tienda_user.forEach((element, index)=>{
          if (element["nombre"] == user){
              registrado += 1;
          }
        });
        
        if (registrado != 0) {
          fichero = user_correcto;
          res.setHeader('Set-Cookie', "user=" + user);
        }else{
          fichero = user_denegado;
        }
    }

    if (fichero == login && user != null){
            fichero = carrito;
    }

    if (fichero == add_carro) {
      if (user != null) {
        fichero = compra;
        var cantidad = myURL.searchParams.get('cantidad');
        var destino = myURL.searchParams.get('destino');

        tienda_user.forEach((element, index)=>{
          if (element["nombre"] == user){
              element["carrito"][destino] = cantidad;
          }
        });

      } else {
        fichero = login;
      }
    }

    if (fichero == "./ContenidoTienda/compra_correcta") {
      //-- Resolución compra     
      tienda_user.forEach((element, index)=>{
        if (element["nombre"] == user){
          if (element["carrito"]["roma"] == 0 &&
              element["carrito"]["paris"] == 0 &&
              element["carrito"]["atenas"] == 0){
                fichero = compra_denegada;
          }else{
            fichero = compra_correcta;
            element["carrito"]["roma"] = 0;
            element["carrito"]["paris"] = 0;
            element["carrito"]["atenas"] = 0;
          }
        }
      });
      //-- Añadir a JSON la información
      var name = myURL.searchParams.get('nombre');
      var apellidos = myURL.searchParams.get('apellidos');
      var email = myURL.searchParams.get('email');
      var direccion = myURL.searchParams.get('direccion');
      var tarjeta = myURL.searchParams.get('tarjeta');

      tienda_pedidos.push({"Nombre": name, "Apellido": apellidos, "Email": email,
                           "Direccion": direccion, "Tarjeta": tarjeta});

      //console.log(tienda_pedidos);
    }


    fs.readFile (fichero, function(err, data) {

        if (err) {  //-- Ha ocurrido algun error
            console.log("Error!!!!!!!!!!!");

            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end(PAG_ERROR);
        
        } else {  //-- Lectura normal
            

          if (user != null && fichero == pagina_inicio) {
            //-- Añadir a la página el nombre del usuario
              data = PRINCIPAL.replace("Login", "Usuario: " + user);
          }

          if (fichero == carrito) {
              var carro_cliente = CARRO.replace("Login", "<h2>Usuario: " + user + "</h2>");
              
              tienda_user.forEach((element, index)=>{
                if (element["nombre"] == user){
                  var carro_cliente1 = carro_cliente.replace("registroRoma", element["carrito"]["roma"]);
                  var carro_cliente2 = carro_cliente1.replace("registroParis", element["carrito"]["paris"]);
                  data = carro_cliente2.replace("registroAtenas", element["carrito"]["atenas"]);
                }
              });
          }
            //console.log("Lectura correcta");

            let mime = "text/html";
            
            //Tipo de imágenes
            if (type_file == 'png' || type_file == 'jpg') {
                mime = "image/" + type_file;
            }
        
            // CSS
            if (type_file == "css"){
                mime = "text/css";
            }

            //-- Generar el mensaje de respuesta
            res.writeHead(200, {'Content-Type': mime});
            res.write(data);
            res.end();
            //console.log("---------Final ciclo----------");
        }
    });
});

server.listen(PUERTO);
console.log ("Servidor Tienda, en el puerto " + PUERTO);