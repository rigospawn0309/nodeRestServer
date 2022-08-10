const {response, json} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSingIn = async(req, res = response) => {

    const {id_token} = req.body;
    try {
        const {name, img, email} = await googleVerify( id_token);

        //Generar referencia por si esta en db
        let usuario = await Usuario.findOne({ email });
        if ( !usuario ){
            //tengo que crearlo si no existe el usuario
            const data = {
                name,
                email,
                password: ':P',
                img,
                google: true
            }
            usuario = new Usuario( data);
            console.log(usuario)
            await usuario.save();
        }
        // si el usuario de google esta con status false hay que negar su autenticación
        if ( !usuario.status ){
            console.log(usuario.status)
            return res.status(401).json({
                msg: 'Usuario bloqueado - Por favor contacte con el administrador'
            })
        }

        // generar JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })
        console.log(usuario);
        console.log(token);
        
    } catch (error) {
        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = {
    login,
    googleSingIn
}