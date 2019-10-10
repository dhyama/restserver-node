/****************************************************************************
 * Fichero de configuración de los controladores o rutas de las peticiones  *
 *  del servicio para Categoria                                               *
 ***************************************************************************/

//Importamos la librería de Express para generar servicios
const express = require('express');

//Importamos el esquema que hemos generado
const Categoria = require('../models/categoria'); //Por convención se pone en mayuscula ya que vamos a generar objetos con new

//Importamos la funcionalidad de verificación de tokens, podemos importar la libreria al completo como en la linea de arriba, o solo la función que queremos como en este caso
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//Creamos la constante donde almacenaremos el servicio REST de la librería Express
const app = express();

/**
 * Controlador mediante la que obtenemos los registros de categoria de la BD
 */
app.get('/categoria', verificaToken, (req, res) => { //En el segundo parámetro estamos indicando cual es el middleware que se va a ejecutar paravalidar esta función

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    Categoria.find()
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                    ok: false,
                    err
                });
            }
            //Queremos obtener la cantidad de registros de la colección obtenida
            Categoria.countDocuments(condicion, (err, conteo) => { //count pasa a estar deprecated

                //Devolvemos el listado de categorias obtenidas con la función find más el conteo de las mismas
                res.json({
                    ok: true,
                    usuarioLogin,
                    cuantos: conteo,
                    categorias
                });
            });
        });
});

/**
 * Controlador mediante el que obtenemos un registro de categoría de la BD pasando el ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;

    //Accedemos a las funciones del esquema para buscar y actualizar es estado del usuario a false
    Categoria.findById(id, (err, categoriaBD) => {

        //Tratamiento de errores
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Devolevemos el resultado y la categoría obtenida en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            usuario: categoriaBD
        });
    });
});

/**
 * Controlador mediante la que creamos un registro de categoría de la BD
 */
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Recogemos el valor de la cabecera de la llamada
    let categoriaParam = req.body;

    //Creamos una instancia con el esquema de categoria
    let categoria = new Categoria({
        descripcion: categoriaParam.descripcion,
        usuario: userLogin.id
    });

    //Guardamos en la base de datos la categoría generada
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Si llegamos aquí es por que no nos hemos salido por el return del error y devolvemos un json con la categoría guardado
        res.json({
            ok: true,
            usuarioLogin,
            categoria: categoriaDB
        });
    });
});


/**
 * Controlador mediante la que actualizamos un registro de categoría de la BD
 */
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;

    //Recogemos el valor de la cabecera de la llamada
    let categoriaParam = req.body.descripcion;

    //Accedemos a las funciones del esquema para buscar la categoría
    Categoria.findByIdAndUpdate(id, categoriaParam, { new: true }, (err, categoriaDB) => {
        //Para obtener la categoría actualizado miramos la documentación de la función y en el tercer parametro de opciones tenemos que pasar -> new:true       

        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Devolevemos el resultado y la categorís en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            categoria: categoriaDB
        });
    });
});

/**
 * Controlador mediante el que borramos físicamente un registro de categoría de la BD
 */
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //Recogemos la información del usuario verificado en el token y que está trabajando con la aplicación
    let usuarioLogin = {
        userLogin: req.usuario
    }

    //Obtenemos el parametro id de la llamada
    let id = req.params.id;

    //Accedemos a las funciones del esquema para buscar y borrar la categoría
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        //Tratamiento de errores
        if (err) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err
            });
        }

        //Si la categoría enviada no existia, no se produce ningún error, pero debemos controlarlo
        if (!categoriaBorrada) {
            return res.status(400).json({ //Generamos un código de error y un mensaje que se mostrata en la respuesta http, ponemos el return para salir de la ejecución en caso de error
                ok: false,
                err: {
                    message: 'Categoría no encontrado'
                }
            });
        }

        //Devolevemos el resultado y la categoría borrada en el formato json
        res.json({
            ok: true,
            usuarioLogin,
            categoria: categoriaBorrada
        });
    });
});


//Exportamos la configuración del controlador Categoria
module.exports = app;