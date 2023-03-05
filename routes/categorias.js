const { Router } = require('express');
const { check } = require('express-validator');
const { validarJSW, esAdmin } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');
const { crearCategoria, categoriasGet, categoriaGetOne, categoriaPut, categoriaDelete } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();


// Obtener todas las categorias - publico
router.get('/', categoriasGet);

// Obtener una cateogria - publico
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId )
], categoriaGetOne);

// Crear categoria - privado -> Token
router.post('/', [ 
    validarJSW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria );

// Actualizar categoria - privado -> Token
router.put('/:id',[ 
    validarJSW,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
], categoriaPut);

// Borrar categoria - privado -> Token
router.delete('/:id',[
    validarJSW,
    esAdmin,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
], categoriaDelete);


module.exports = router;