const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivos, mostrarImagen, actualizarImagenCloudinary } = require('../controller/uploads.controller');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router = Router();

router.post('/',validarArchivoSubir, cargarArchivos)
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'No es un ID válido de Mongo')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
] , actualizarImagenCloudinary)
router.get('/:coleccion/:id',[
    check('id', 'No es un ID válido de Mongo')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['usuarios', 'productos'] )),
    validarCampos
] , mostrarImagen)
module.exports = router;