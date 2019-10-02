/*****************************************************
 * Modulo en el que implementaremos el servicio REST *
 *****************************************************/
//Importamos el fichero de configuración de la aplicación que hemos definido
require('./config/config');

//Importamos la librería de expres para generar servicios
const express = require('express');
//Importamos la libreria para procesar los datos de cabeceras de las llamadas al servicio
const bodyParser = require('body-parser');

//Creamos la constante donde almacenaremos el servicio REST
const app = express();

//Incluimos los middelwares para el procesamineto de cabeceras (cuando encontramos un app.use es un middleware)
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Configuramos la respuesta a peticiones get para el path '/'
app.get('/usuario', function(req, res) {
    res.json('get usuario');
})

//Configuramos la respuesta a peticiones get para el path '/'
app.post('/usuario', function(req, res) {

    //recogemos el valor de la cabecera
    let usuario = req.body;
    //Comprobamos si tenemos nombre
    if (usuario.nombre === undefined) {
        res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({ usuario });
    }

})

//Configuramos la respuesta a peticiones get para el path '/'
app.put('/usuario/:id', function(req, res) {
    //Obtenemos el parametro id de la llamada
    let id = req.params.id;
    //Devolevemos el id obtenido
    res.json({ id });
})

//Configuramos la respuesta a peticiones get para el path '/'
app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
})

//Configuramos el puerto en el que tenemos corriendo el servicio
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});