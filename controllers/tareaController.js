const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crea una nueva Tarea
exports.crearTarea = async (req, res) => {
    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { proyecto } = req.body;

    try {
        const proyectoTarea = await Proyecto.findById(proyecto);
        if (!proyectoTarea) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario actual
        if (proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Creamos la Tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Obtener las tareas de un proyecto
exports.obtenerTareas = async (req, res) => {
    try {
        const { proyecto } = req.query;
        const proyectoTarea = await Proyecto.findById(proyecto);
        if (!proyectoTarea) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        // Revisar si el proyecto actual pertenece al usuario actual
        if (proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Actualiza una tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const { proyecto, nombre, estado } = req.body;

        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Revisar si el proyecto actual pertenece al usuario actual
        const proyectoTarea = await Proyecto.findById(proyecto);
        if (proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // Crear objeto con la nueva info
        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};

// Eliminar una tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrada' });
        }

        // Revisar si el proyecto actual pertenece al usuario actual
        const proyectoTarea = await Proyecto.findById(proyecto);
        if (proyectoTarea.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        // ELiminar tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea Eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
};