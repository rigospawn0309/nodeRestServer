const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;
    try {
        //verificar si  el email existe
        const usuario = await Usuario.findOne({email});
        if( !usuario ){ 
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - correo'
            })
        }

        //si usuario esta activo en base de datos
        if( !usuario.status ){ 
            return res.status(400).json({
                msg: 'Usuario/Password no son correctos - estado:false'
            })
        }

        // verificar la contraseña
        const validPassword =  bcryptjs.compareSync( password, usuario.password)
        if (!validPassword){
            return res.status(400).json({
                msg: 'Password no son correctos - password'
            })
        }
        // generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(500).json({
            msg: 'Algo ha fallado',
            error
        })
    }

}

module.exports = {
    login
}