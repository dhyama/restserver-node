/*****************************************************
 * Modulo en el que implementaremos el servicio REST *
 *****************************************************/

//Importamos la librería de expres para generar servicios
const express = require('express')

//Creamos la constante donde almacenaremos el servicio REST
const app = express()

//Configuramos la respuesta a peticiones get para el path '/'
app.get('/', function(req, res) {
    res.json('Hello World')
})

//Configuramos el puerto en el que tenemos corriendo el servicio
app.listen(3000, () => {
    console.log('Escuchando puerto: ', 3000);
});