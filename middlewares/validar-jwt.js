const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');



const validarJWT = async (req, res, next) => {

    const token = req.header('x-token');
    // si no hay token en la peticion saco al usuario con un error asignado
    if( !token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    //leo el usuario que corresponde con el uid logeado
    const usuario =  await Usuario.findById(uid);  
    //Verificar si el usuario existe en la DB
    if(!usuario){
        return res.status(401).json({
            msg: 'Token no válido - usuario no existe en DB'
        })
    }
    //Verificar si el uid tiene status true
    if(!usuario.status){
        return res.status(401).json({
            msg: 'Token no válido - usuario con estado: false'
        })
    }

    req.usuario = usuario;
    next();

    } catch (error) { 
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        })
    }
  
}


module.exports = {
    validarJWT
}