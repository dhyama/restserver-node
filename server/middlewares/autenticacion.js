/***********************************************************************
 * Módulo para realizar las validación de autorización mediante tokens *
 ***********************************************************************/

//Importamos la libreria de validación de tokens
const jwt = require('jsonwebtoken');

//=====================
//Verificación token
//=====================
/**
 * Función middleware para la verificación de un token
 * @param {*} req Solicitud que estamos recibiendo
 * @param {*} res Respuesta a devolver
 * @param {*} next Continuar con la ejecución del programa, si no lo ejecutamos el programa no continua su ejecución
 */
let verificaToken = (req, res, next) => {
    let token = req.get('token'); //Recogemos el token del header de la llamada recibida

    jwt.verify(token, process.env.SEED, (err, decode) => { //Función de la libreria que verifica un token con la semilla que lo generó.

        //Comprobamos si se ha producido un error de autorización
        if (err) {
            return res.status(401).json({ //Devolvemos un unauthorized
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //En el decoded tenemos la información decodificada del PAYLOAD (Un token se divide en HEADER,PAYLOAD,SIGNATURE)
        // por lo que devolvemos la información decodificada del usuario
        req.usuario = decode.usuario
            //Proseguimos con la ejecución de la aplicación
        next();

    });

}

//Exportamos la funciones
module.exports = {
    verificaToken
}