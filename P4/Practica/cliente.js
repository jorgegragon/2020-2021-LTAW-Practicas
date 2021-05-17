//-- Elementos del interfaz
let display = document.getElementById("display");
let msg_entry = document.getElementById("msg_entry");
let actions = document.getElementById("actions");
let username = document.getElementById("username");

//-- Crear un websocket. Se establece la conexión con el servidor
const socket = io();

socket.on("message", (msg)=>{
  console.log (msg);
  display.innerHTML += '<p style="color:black">' + msg.username + ": " + msg.message + '</p>';
  actions.innerHTML = "";
});

socket.on("escritura", (msg)=>{
  actions.innerHTML = "<p>" + msg + " está escribiendo...<p>";
});

socket.on("comandos", (msg)=>{
  if (msg.username == username.value) {
    msg.username = "Admin";
    display.innerHTML += '<p style="color:red">' + msg.username + ": " + msg.message + '</p>';
  }
  actions.innerHTML = ""; 
});
//-- Al apretar el botón se envía un mensaje al servidor
msg_entry.onchange = () => {
  if (msg_entry.value){
    if (username.value == ""){
      socket.emit("message", {
        message : "Debes rellenar el campo de Nickname para poder escribir.",
        username : "Admin"
      });
    }else{
      socket.emit("message", {
        message : msg_entry.value,
        username : username.value
      });
    }
  }
  //-- Borrar el mensaje actual
  msg_entry.value = "";
}
//-- Al escribir se envía un mensaje al servidor
msg_entry.addEventListener('keypress', function(){
  socket.emit("escritura", username.value);
});
