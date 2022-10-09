const { Condition, Categoria, Producto, Role, Usuario } = require('../models');

    // verificar si el rol es Valido
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

    //verificar si la categoria existe
const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if ( !existeCategoria ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

    //verificar si el producto existe
const existeProductoPorId = async( id ) => {
    const existeProducto = await Producto.findById(id);
    if ( !existeProducto ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

//Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes( coleccion )
    if(!incluida){
        throw new Error(`la colección ${ coleccion } no es permitida ${ colecciones }`)
    }
    return true;
}

module.exports = {
    esRoleValido,
    esEmailExistente,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}