const { Router } = require('express');
const { check } = require('express-validator');
const { getProducto, getProductos, postProducto, putProducto, deleteProducto } = require('../controller/productos.controller');

const { existeProductoPorId } = require('../helpers/db-validators');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const router = Router(); 
//Get
//obtener todas las categorias - público
router.get('/', getProductos);

//Get por Id
//obtener una categoria - público - controlar que no sea null con un middleware 
router.get('/:id',[
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail()
    .custom( existeProductoPorId ),
    validarCampos

], getProducto);

//Post
router.post('/',[
    validarJWT,
    check('brand', 'La marca es obligatoria').not().isEmpty(),
    check('model', 'El modelo es obligatorio').not().isEmpty(),
    check('operator', 'El operador es obligatorio').not().isEmpty(),
    check('condition', 'El estado es obligatorio').not().isEmpty(),
    check('condition', 'El estado no es valido').isIn(['NUEVO','USADO','NO_FUNCIONA']),
    check('categoria', 'No es un ID de Categoría válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    validarCampos   
], postProducto);

//Put
//actualizar un registro por id un producto - privado con cualquier token valido
router.put('/:id',[
    validarJWT,
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('id').custom( existeProductoPorId ),
    check('categoria', 'No es un ID de Categoría válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('condition', 'El estado no es valido').isIn(['NUEVO','USADO','NO_FUNCIONA']),
    validarCampos
],putProducto );

//Delete
//borrar un producto - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail(),
    check('id').custom( existeProductoPorId ),
    validarCampos
], deleteProducto );


module.exports = router;