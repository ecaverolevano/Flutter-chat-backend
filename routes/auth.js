/**
 * path api/login
 */
//
const { Router } = require('express');
const { check } = require('express-validator');

//Mias
const { crearUsuario, login, renewToken } = require('../controllers/auth_controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();


router.post('/new', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Ingrese un email correcto').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
],crearUsuario);

router.post('/',[
    check('email', 'Ingrese un email correcto').isEmail(),
    check('password', 'La contraseña es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.get('/renew', validarJWT, renewToken);


module.exports = router;