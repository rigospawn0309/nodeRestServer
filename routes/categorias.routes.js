const { Router } = require('express');
const { check } = require('express-validator');

const { postCategoria, getCategorias, putCategoria, getCategoria, deleteCategoria } = require('../controller/categorias.controller');

const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const {  esAdminRole } = require('../middlewares');

const router = Router();

//obtener todas las categorias - público
router.get('/', getCategorias);

//obtener una categoria - público - controlar que no sea null con un middleware 
router.get('/:id',[
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail()
    .custom( existeCategoriaPorId ),
    validarCampos

], getCategoria);

//crear una categoria - privado con cualquier token valido
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos   
] , postCategoria );

//actualizar un registro por id una categoria - privado con cualquier token valido
router.put('/:id',[
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],putCategoria );

//borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], deleteCategoria);



module.exports = router;