const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, esEmailExistente, existeUsuarioPorId } = require('../helpers/db-validators');

const { userGet, userPost, userPut, userDelete } = require('../controller/user.controller');
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
} = require('../middlewares')
const router = Router();

router.get('/', userGet );

router.put('/:id',[
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail()
    .custom( existeUsuarioPorId ),
    check('role').custom( esRoleValido ), 
    validarCampos
],userPut );

// path + middlewares + controlador
router.post('/',[
    check('name', 'el nombre es obligatorio').not().isEmpty(),
    check('email', 'el correo no es valido').isEmail(),
    check('email').custom( esEmailExistente ),
    check('password', 'el password debe contener al menos 6 caracteres').isLength({min:6}),
    check('role').custom( esRoleValido ),
    validarCampos
], userPost);

router.delete('/:id',[
    validarJWT,
    //esAdminRole,
    tieneRole('ADMIN_ROLE','USER_ROLE'),
    check('id', 'No es un ID válido')
    .exists({ checkNull: true }).bail()
    .isMongoId().bail()
    .custom( existeUsuarioPorId ),
    validarCampos
], userDelete);

module.exports = router;