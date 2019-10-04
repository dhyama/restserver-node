/****************************************************************************
 * Fichero de configuración de acceso a los distintos controladores o rutas *
 *  de las peticiones  del servicio                                         *
 ***************************************************************************/

//Importamos la librería de Express para generar servicios
const express = require('express');

//Creamos la constante donde almacenaremos el servicio REST de la librería Express
const app = express();

// Cargamos los controladores del servicio de Usuario definidas en el fichero usuario.js
app.use(require('./usuario'));

// Cargamos los controladores del servicio de Login definidas en el fichero login.js
app.use(require('./login'));

//Exportamos la configuración de controladores
module.exports = app;