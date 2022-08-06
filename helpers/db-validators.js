const Role = require('../models/role');
const Usuario = require('../models/usuario');

    // verificar si el rol ya existe
const esRoleValido = async(role = '') => {
    const existeRol = await Role.findOne({role});
    if( !existeRol ){
        throw new Error(`el Rol ${role} no está registrado en la BD`)
    }
}

    //verificar si el correo existe
const esEmailExistente = async(email = '') => {
    const existeEmail = await Usuario.findOne({email})
    if (existeEmail) {
        throw new Error(`el correo ${email} ya está registrado`)
    }
}

    //verificar si el usuario existe
const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}


module.exports = {
    esRoleValido,
    esEmailExistente,
    existeUsuarioPorId
}