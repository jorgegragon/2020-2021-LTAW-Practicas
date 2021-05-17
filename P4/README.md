 # Práctica 4

 ## Localización
    Se encuentra en la carpeta de Practica.

 ## Paquetes usados
    * "colors": "^1.4.0",
    * "electron": "^12.0.7",
    * "express": "^4.17.1",
    * "i": "^0.3.6",
    * "ip": "^1.1.5",
    * "socket.io": "^4.0.1",
    * "wscat": "^4.0.1"
 
 ## Inicialización de la práctica
    Para iniciar la práctica, debemos estar en el directorio correcto. Una vez estamos allí, usamos el comando:
        * npm start
    Para conectarnos con los clientes, debemos usar en el navegador la siguiente URL:
        * http://127.0.0.1:8080/ o con la dirección IP que aparece en la interfaz gráfica.
 
 ## Funcionamiento de la práctica
 ### Interfaz gráfica
    En la interfaz gráfica aparecerá la siguiente información y opciones:
    * Versión de node
    * Versión de Electron
    * Versión de Chrome
    * URL a la que se deben conectar los clientes para chatear
    * Mostrar los mensajes que llegan al servidor, del resto de usuarios
    * Botón de pruebas para enviar un mensaje a todos los clientes conectados

 ### Cliente
    Los clientes pueden comunicarse entre ellos, siempre y cuando rellenen tanto el campo del nickname como el campo de mensaje.

    Cuando un usuario esta escribiendo, con un nickname establecido, los demas usuarios pueden ver un mensaje en su chat, que indica que dicho usuario esta escribiendo.

    Los usuarios pueden comunicarse con el servidor, a traves del comando /help, que proporcionará los comandos de repuesta que puede utilizar.

    Una vez dentro del chat, si desea salirse, se debe pulsar en la parte superior donde pone Mini-Chat.
