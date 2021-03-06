/*****************************************************
 * Modulo en el que implementaremos el servicio REST *
 *****************************************************/
//Importamos el fichero de configuración de la aplicación que hemos definido
require('./config/config');
//Importamos la libreria para colores en consola
require('colors');

//Importamos la librería de expres para generar servicios
const express = require('express');
//Importamos la librería mongoose para conectar con la BD MongoDB
const mongoose = require('mongoose');
//Importamos la libreria para procesar los datos de cabeceras de las llamadas al servicio
const bodyParser = require('body-parser');
//Importamos el paquete para trabajar con rutas (viene instalado)
const path = require('path');

//Creamos la constante donde almacenaremos el servicio REST de Express
const app = express();

//Incluimos los middelwares para el procesamineto de cabeceras (cuando encontramos un app.use es un middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// habilitamos la carpeta public como accesible para los usuarios
app.use(express.static(path.resolve(__dirname, '../public')));
// console.log(path.resolve(__dirname, '../public'));

// //Cargamos los controladores del servicio de Usuario definidas en el fichero usuario.js
// app.use(require('./routes/usuario'));
// //Cargamos los controladores del servicio de Login definidas en el fichero login.js
// app.use(require('./routes/login'));
//Trasladamos esta configuración de controladores al fichero index.js
app.use(require('./routes/index'));

//Configuramos la conexion con la base de datos
mongoose.connect(process.env.URLDB, { //'mongodb://localhost:27017/cafe' Esta variable la hemos configurado en el fichero de configuración
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    (err, res) => {
        if (err) {
            throw new Error(`Error en la conexion con la base de datos : ${err} `.red);
        }

        console.log('Base de datos ONLINE'.green);
    });

//Configuramos el puerto en el que tenemos corriendo el servicio
app.listen(process.env.PORT, () => {
    console.log('Servicio REST escuchando en puerto: '.blue, process.env.PORT.yellow);
});