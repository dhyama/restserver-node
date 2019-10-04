/****************************************************************************
 * Fichero de configuración de los controladores o rutas de las peticiones  *
 *  del servicio para Usuario                                               *
 ***************************************************************************/

//Importamos la librería de Express para generar servicios
const express = require('express');
//Importamos la librería para encriptación
const bcrypt = require('bcrypt');
//Importamos la librería para ampliar la funcionalidad de javascript 
const _ = require('underscore');

//Importamos el esquema que hemos generado
const Usuario = require('../models/usuario'); //Por convención se pone en mayuscula ya que vamos a generar objetos con new

//Importamos la funcionalidad de verificación de tokens, podemos importar la libreria al completo como en la linea de arriba, o solo la función que queremos como en este caso
const { verificaToken } = require('../middlewares/autenticacion');

//Creamos la constante donde almacenaremos el servicio REST de la librería Express
const app = express();

/**
 * Controlador mediante la que obtenemos los registros de usuario de la BD
 */
app.get('/usuario', verificaToken, (req, res) => { //En el segundo parámetro estamos indicando cual es el middleware que se va a ejecutar paravalidar esta función

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Para realizar paginación de datos obtenemos los parámetros desde la entrada, sino los ponemos por defecto
    let desde = req.query.desde || 0;
    desde = Number(desde); //Falta validación de número

    let limite = req.query.limite || 5;
    limite = Number(limite); //Falta validación de número

    const condicion = { estado: true }; //Si queremos filtrar ponemos ej. {google:true}
    const camposMostrar = 'nombre email role estado img'; //Indicamos que campos son los que queremos ver en el resultado

    Usuario.find(condicion, camposMostrar)
        .skip(desde) //Indicamos que queremos saltarnos x registros
        .limit(limite) //Indicamos el número de registros que queremos obtener
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                    ok: false,
                    err
                });
            }
            //Queremos obtener la cantidad de registros de la colección obtenida
            Usuario.countDocuments(condicion, (err, conteo) => { //count pasa a estar deprecated

                //Devolvemos el listado de usuarios obtenidos con la función find más el conteo de los mismos
                res.json({
                    ok: true,
                    usuarioLogin,
                    cuantos: conteo,
                    usuarios
                });
            });
        });
});

/**
 * Controlador mediante la que creamos un registro de usuario de la BD
 */
app.post('/usuario', verificaToken, (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Recogemos el valor de la cabecera de la llamada
    let usuarioParam = req.body;

    //Creamos una instancia con el esquema de usuario
    let usuario = new Usuario({
        nombre: usuarioParam.nombre,
        email: usuarioParam.email,
        password: bcrypt.hashSync(usuarioParam.password, 10), //El segundo parametro es el número de vueltas que hay que realizar para la ENCRIPTACIÓN (10 es suficiente)
        role: usuarioParam.role
    });

    //Guardamos en la base de datos el usuario generado
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //La contraseña encriptada no es un dato que el usuario necesite, por lo que la quitamos de la respuesta
        // usuarioDB.password = null; (Esta configuración la hemos llevado al esquema de usuario modificando la función json de devolución)

        //Si llegamos aquí es por que no nos hemos salido por el return del error y devolvemos un json con el usuario guardado
        res.json({
            ok: true,
            usuarioLogin,
            usuario: usuarioDB
        });
    });
});

/**
 * Controlador mediante la que actualizamos un registro de usuario de la BD
 */
app.put('/usuario/:id', verificaToken, (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;
    //Obtenemos el cuerpo de la llamada
    // let usuarioParam = req.body;

    //Hay campos que no queremos que el usuario actualice cuando haga un put, como puede ser el password y la cuenta de google
    // La forma mas sencilla es eliminarlos del objeto que vamos a mandar para actualizar
    // delete usuarioParam.google;
    // delete usuarioParam.password;

    //Pero si tenemos muchos campos mejor utilizar la función pick de la libreria underscore
    let usuarioParam = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    //Accedemos a las funciones del esquema para buscar el usuario
    Usuario.findByIdAndUpdate(id, usuarioParam, { new: true, runValidators: true }, (err, usuarioDB) => {
        //Para obtener el usuario actualizado miramos la documentación de la función y en el tercer parametro de opciones tenemos que pasar -> new:true
        //Para lanzar las validaciones que tenemos definidas en el esquema y evitar que podamos pasar un role no definido tenemos que pasar -> runValidators: true

        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Devolevemos el resultado y el usuario en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            usuario: usuarioDB
        });
    });
});

/**
 * Controlador mediante el que marcamos como borrado un registro de usuario de la BD
 */
app.delete('/usuario/:id', verificaToken, (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;

    //Definimos los cambios que queremos realizar
    let cabiaEstado = {
        estado: false
    };

    //Accedemos a las funciones del esquema para buscar y actualizar es estado del usuario a false
    Usuario.findByIdAndUpdate(id, cabiaEstado, { new: true }, (err, usuarioBorrado) => {

        //Tratamiento de errores
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Devolevemos el resultado y el usuario borrado en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            usuario: usuarioBorrado
        });
    });
});

/**
 * Controlador mediante el que borramos físicamente un registro de usuario de la BD
 */
app.delete('/usuario/:id/remove', verificaToken, (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;

    //Accedemos a las funciones del esquema para buscar y borrar el usuario
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

        //Tratamiento de errores
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Si el susario enviado no existia, no se produce ningún error, pero debemos controlarlo
        if (!usuarioBorrado) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        //Devolevemos el resultado y el usuario borrado en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            usuario: usuarioBorrado
        });
    });
});

//Exportamos la configuración del controlador Usuario
module.exports = app;