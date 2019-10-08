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

//Importamos la librería para autentificación mediante Sing-in
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

//Importamos el esquema que hemos generado
const Usuario = require('../models/usuario'); //Por convención se pone en mayuscula ya que vamos a generar objetos con new

//Creamos la constante donde almacenaremos el servicio REST de la librería Express
const app = express();


/**
 * Controlador mediante el que nos validamos en la aplicación
 */
app.post('/login', (req, res) => {

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

//Configuración necesaria para la validación contra Google

//Al ser una función async el resultado debe de ser una promesa
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    // console.log(userid);

    //Creamos el objeto con toda la información del usuario de google (googleUser)
    return {
        nombre: payload.name,
        email: payload.email,
        pic: payload.picture,
        google: true
    }
}
// verify().catch(console.error);

/**
 * Controlador mediante el que nos validamos en la aplicación con Google Sing-in
 */
app.post('/logingoogle', async(req, res) => {

    //Cuando llamamos a la validación de google recibimos el token
    let token = req.body.idtoken;

    //Llamamos a la función de verificación
    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        });

    //Si no se ha producido ningun error realizamos las validaciones necesarias contra nustra BD despues de validación con Sing-In
    //Buscamos un usuario en nuestra base de datos que tenga el email validado en Sing-In
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        //Comprobamos si hemos tenido algún error en la consulta
        if (err) {
            return res.status(500).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        };

        //Si tenemos un usuario valido se pueden dar varios escenarios
        if (usuarioDB) {
            //El usuario no se ha validado con Sing-In
            if (usuarioDB.google === false) {
                //Comprobamos si hemos tenido algún error en la consulta
                if (err) {
                    return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                        ok: false,
                        err: {
                            message: 'Debe utilizar su autentificación normal.'
                        }
                    });
                }
            } else { //Ususario autenticado por Sing-In anteriormente
                //renovarmos el token                
                let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //Expira en 30 dias configurada en el fichero de config.js

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });

            }
        } else { //El usuario no se ha validado nunca, por lo que es un nuevo usuario

            //Creamos un nuevo usuario 
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.pic;
            usuario.google = true;
            usuario.password = 'Dhyama12345'; //La contraseña es obligatoria, por lo que la inicializamos para que no de error, como es la de google, nunca se va a utilizar y va a estar encriptada

            //Damos de alta el nuevo usuario en la BD
            usuario.save((err, usuarioDB) => {
                //Comprobamos si hemos tenido algún error en la consulta
                if (err) {
                    return res.status(500).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                        ok: false,
                        err
                    });
                }

                //Si no se ha producido erro renovarmos el token                
                let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //Expira en 30 dias configurada en el fichero de config.js

                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    })

    // res.json({
    //     usuario: googleUser
    // });

});


//Exportamos la configuración del controlador Usuario
module.exports = app;