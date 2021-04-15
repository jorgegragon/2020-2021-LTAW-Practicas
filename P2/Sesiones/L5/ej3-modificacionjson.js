//-- Lectura y modificación de un fichero JSON
const fs = require('fs');

//-- Npmbre del fichero JSON a leer
const FICHERO_JSON = "ej2-tienda.json"

//-- NOmbre del fichero JSON de salida
const FICHERO_JSON_OUT = "ej2-tienda.json"

//-- Leer el fichero JSON
const  tienda_json = fs.readFileSync(FICHERO_JSON);

//-- Crear la estructura tienda a partir del contenido del fichero
const tienda = JSON.parse(tienda_json);

//-- Modificar productos
tienda[0]["stock"] += 1;
tienda[1]["stock"] += 1;
tienda[2]["stock"] += 1;

//-- Convertir la variable a cadena JSON
let myJSON = JSON.stringify(tienda);

//-- Guardarla en el fichero destino
fs.writeFileSync(FICHERO_JSON_OUT, myJSON);

console.log("Información guardada en fichero: " + FICHERO_JSON_OUT);