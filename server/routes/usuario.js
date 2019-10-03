/****************************************************************************
 * Fichero de configuración de los controladores o rutas de las peticiones  *
 *  del servicio para Usuario                                               *
 ***************************************************************************/

//Importamos la librería de expres para generar servicios
const express = require('express');
//Importamos el esquema que hemos generado
const Usuario = require('../models/usuario'); //Por convención se pone en mayuscula ya que vamos a generar objetos con new

//Creamos la constante donde almacenaremos el servicio REST
const app = express();

//Configuramos la respuesta a peticiones get para el path '/'
app.get('/usuario', function(req, res) {
    res.json('get usuario');
})

//Configuramos la respuesta a peticiones get para el path '/'
app.post('/usuario', function(req, res) {

    //recogemos el valor de la cabecera
    let usuarioParam = req.body;

    let usuario = new Usuario({
        nombre: usuarioParam.nombre,
        email: usuarioParam.email,
        password: usuarioParam.password,
        role: usuarioParam.role
    }); //Creamos una instancia con el esquema de usuario

    //Guardamos en la base de datos el usuario generado
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Si llegamos aquí es por que no nos hemos salido por el return del error y devolvemos un json con el usuario guardado
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
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

//Exportamos la configuración del controlador Usuario
module.exports = app;