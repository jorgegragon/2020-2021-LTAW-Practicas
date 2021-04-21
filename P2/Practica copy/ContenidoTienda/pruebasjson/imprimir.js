const http = require('http');
const url = require('url');
const fs = require('fs');
//-- Fichero JSON
const FICHERO_JSON = "archivo.json";
const tienda_json = fs.readFileSync(FICHERO_JSON);
const tienda = JSON.parse(tienda_json);

const tienda1 = tienda["Usuarios"];

tienda1.forEach((element, index)=>{
    if(element.nombre == "jorge"){
        console.log (element["carrito"]["roma"]);
    }
});

//console.log(tienda);