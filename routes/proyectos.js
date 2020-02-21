const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

// Crea Proyectos
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);
// Obtiene Proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);
// Actualiza Proyecto
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);
// Elimina Proyecto
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;
