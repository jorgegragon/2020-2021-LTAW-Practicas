//-- Cargar las dependencias
const socket = require('socket.io');
const http = require('http');
const express = require('express');
const colors = require('colors');
const fs = require('fs');
const electron = require('electron');

const PUERTO = 8080;
var contador = 0;

//-- Crear una nueva aplciacion web
const app = express();

//-- Variable para acceder a la ventana principal
let win = null;

//-- Crear un servidor, asosiaco a la App de express
const server = http.Server(app);

//-- Crear el servidor de websockets, asociado al servidor http
const io = socket(server);
const INICIO = fs.readFileSync('./html/inicio.html','utf-8');

//-------- PUNTOS DE ENTRADA DE LA APLICACION WEB
//-- Definir el punto de entrada principal de mi aplicación web
app.get('/', (req, res) => {
  res.send(INICIO);
});

//-- Esto es necesario para que el servidor le envíe al cliente la
//-- biblioteca socket.io para el cliente
app.use('/', express.static(__dirname +'/'));

//-- El directorio publico contiene ficheros estáticos
app.use(express.static('public'));


//-- Punto de entrada electron 
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //-- Crear la ventana principal de nuestra aplicación
  win = new electron.BrowserWindow({
      width: 800,   //-- Anchura 
      height: 600,  //-- Altura

      //-- Permitir que la ventana tenga ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });

  win.loadFile("index.html");

  //-- Esperar a que la página se cargue y se muestre
  //-- y luego enviar el mensaje al proceso de renderizado para que 
  //-- lo saque por la interfaz gráfica
  win.on('ready-to-show', () => {
    win.webContents.send('print', contador);
  });

  win.webContents.send('print', contador);
});

electron.ipcMain.handle('test', (event, msg) => {
  
  var msg = {};
  msg.username = "Admin";
  msg.message = "Hola!";
  io.sockets.emit("message", msg);
  console.log("-> Mensaje: " + msg.message);
});

//----- GESTION SOCKETS IO
//-- Evento: Nueva conexion recibida
io.on('connect', (socket) => {
  
  console.log('** NUEVA CONEXIÓN **'.yellow);
  contador += 1;
  win.webContents.send('print', contador);

  //-- Evento de desconexión
  socket.on('disconnect', function(){
    console.log('** CONEXIÓN TERMINADA **'.yellow);
    contador -= 1;
  });
  
  //-- Mensaje recibido: Reenviarlo a todos los clientes conectados
  socket.on("message", (msg)=> {
    console.log(msg.username + ": " + msg.message);
    if (msg.message[0] == "/") {
        switch (msg.message) {
            case "/help":
              msg.message = "/list, /hello, /date";
              io.emit("comandos", msg);
              break;
            case "/list":
              msg.message = "Los usuarios conectados son: " + contador;
              io.emit("comandos", msg);
              break;
            case "/hello":
              msg.message = "hello";
              io.emit("comandos", msg);
              break;
            case "/date":
              var hora = new Date();
              var año = hora.getFullYear();
              var mes = hora.getMonth();
              var dia = hora.getDate();
              msg.message = "Fecha: " + dia + "/" + mes + "/" + año;
              io.emit("comandos", msg);
              break;           
            default:
              io.sockets.emit("message", msg);
        }
    }else{
        //-- Reenviarlo a todos los clientes conectados
        //socket.broadcast.emit("message", msg);
        io.sockets.emit("message", msg);
    }
    win.webContents.send('chat', msg);
  });

  socket.on("escritura", (msg)=> {
    socket.broadcast.emit("escritura", msg);
  });
});

//-- Lanzar el servidor HTTP
//-- ¡Que empiecen los juegos de los WebSockets!
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);