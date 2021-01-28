const jwt = require('jsonwebtoken');

const generarJWT = ( uid ) => {

    return new Promise( (resolve, reject ) => {

        const payload = { uid };

        jwt.sign( payload, process.env.JWT_KEY, {
            expiresIn: '24h', //normalmente debe ser corto
        }, (err, token) => {
            if(err){
                //no se crea el token
                reject('No se pudo generar el JWT'); //lanza el catch
            }
            else{
                //genera el token
                resolve( token );

            }
        });


    });

}

module.exports = {
    generarJWT
}