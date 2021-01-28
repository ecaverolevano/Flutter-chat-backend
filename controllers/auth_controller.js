
const { response } = require("express");
const bcrypt = require('bcryptjs');

const { generarJWT } = require("../helpers/jwt");

const Usuario = require('../models/usuario_model');

const crearUsuario = async (req, res = response) =>{

    const { email, password } = req.body;

    try {
        
        // const existeEmail = await Usuario.findOne({ email: email });
        const existeEmail = await Usuario.findOne({ email });

        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        //Encriptar contraseña
        // salt = encriptado diferente aunque la contraseña sea la misma
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );


        await usuario.save();

        // Generar mi JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            error
        });
    }


}

const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioBD = await Usuario.findOne({ email });

        if( !usuarioBD ){
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el password
        const validarPassword = bcrypt.compareSync( password, usuarioBD.password );

        if( !validarPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'La contraseña no es valida'
            });
        }

        //Generar el JWT
        const token = await generarJWT( usuarioBD.id );
        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }


}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    try {
        
        const token = await generarJWT( uid );

        const usuario = await Usuario.findById( uid );

        if( !usuario ){
            return res.status(401).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }


        return res.json({
            ok: true,
            usuario,
            token
        });

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}

module.exports = {
    crearUsuario,
    login,
    renewToken
}