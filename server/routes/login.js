/****************************************************************************
 * Fichero de configuración de los controladores o rutas de las peticiones  *
 *  del servicio para Login                                                 *
 ***************************************************************************/

//Importamos la librería de Express para generar servicios
const express = require('express');
//Importamos la librería para encriptación
const bcrypt = require('bcrypt');
//Importamos la librería de generación de tokens
const jwt = require('jsonwebtoken');

//Importamos el esquema que hemos generado
const Usuario = require('../models/usuario'); //Por convención se pone en mayuscula ya que vamos a generar objetos con new

//Creamos la constante donde almacenaremos el servicio REST de la librería Express
const app = express();


/**
 * Controlador mediante el que nos validamos en la aplicación
 */
app.post('/login', function(req, res) {

    //Recogemos el valor de la cabecera de la llamada
    let usuarioParam = req.body;

    Usuario.findOne({ email: usuarioParam.email }, (err, usuarioDB) => {
        //Comprobamos si hemos tenido algún error en la consulta
        if (err) {
            return res.status(500).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Comprobamos si hemos obtenido un usuario con el email proporcionado
        if (!usuarioDB) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        //Comparamos la contraseña escrita en la validación (no encriptada) con la recibida de la BD (encriptada), esto lo hace la funcion compareSync
        if (!bcrypt.compareSync(usuarioParam.password, usuarioDB.password)) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //generamos el token
        let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //Expira en 30 dias configurada en el fichero de config.js

        //Como la validación es correcta devolvemos el token
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    })

});


//Exportamos la configuración del controlador Usuario
module.exports = app;