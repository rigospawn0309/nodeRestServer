const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers/subir-archivo');
const { Usuario, Producto } = require('../models');


 const cargarArchivos = async (req, res = response) =>{
        try {
            const nombre = await subirArchivo(req.files, undefined, 'imgs')
            res.json({nombre})
        } catch (msg) {
            res.status(400).json({ msg })
        }
 }

 const actualizarImagen = async (req, res = response) =>{
    const {id, coleccion} = req.params;
    console.log(req.params)

    //se graba
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg:'No esta contemplada esta validación'
            });
    }

    //Limpiar imagenes previas antes de subir
try {
    if(modelo.img){
        //borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }
} catch (error) {
    res.status(400).json({ error })
}

    const nombre =  await subirArchivo(req.files, undefined, coleccion);
    modelo.img = nombre;
    await modelo.save();
     
     
     res.json(modelo)
 }

 const actualizarImagenCloudinary = async (req, res = response) =>{
    const {id, coleccion} = req.params;
    console.log(req.params);

    //se graba
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg:'No esta contemplada esta validación'
            });
    }

    //Limpiar imagenes previas antes de subir

    if(modelo.img){
        //borrar la img del servidor
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
         cloudinary.uploader.destroy( public_id)
        console.log('Public ID: ' , public_id);

    }
    const { tempFilePath } = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
    modelo.img = secure_url;
    await modelo.save();
     
     
     res.json(modelo)
 }

 const mostrarImagen = async (req, res = response) =>{
    const {id, coleccion} = req.params;
    
    //controlar los ids
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                })
            }
            break;
    
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                })
            }
            break;

        default:
            return res.status(500).json({
                msg:'No esta contemplada esta validación'
            });
    }

    //Limpiar imagenes previas antes de subir
try {
    if(modelo.img){
        //borrar la img del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
           return res.sendFile(pathImagen);
        }
    }
} catch (error) {
    res.status(400).json({ error })
}
     const pathPlaceHolder = path.join(__dirname, '../assets/no-image.jpg');
     res.sendFile(pathPlaceHolder);
 }

 module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
 }