const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

// Crea Tareas
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El nombre Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// Obtiene Tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);
// Actualiza Tarea
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatoria').not().isEmpty()
    ],
    tareaController.actualizarTarea
);
// Elimina Tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;
