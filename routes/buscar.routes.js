const { Router } = require('express');
const { buscar } = require('../controller/buscar.controller');


const router = Router();

router.get('/:coleccion/:termino', buscar)

module.exports = router;