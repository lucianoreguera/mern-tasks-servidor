const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // Revisa si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructuring extraer email y password
    const { email, password } = req.body;

    try {
        // Revisar que sea un usuario registrado
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg:'El usuario no esta registrado' });
        }

        // Revisar el password
        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'Password Incorrecto' });
        }

        // Si todo es correcto crear el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        // Firmar el JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            // Mensaje de confirmación
            res.json({ token });
        });
    } catch (error) {
        console.log(error);
    }
};

exports.usuarioAutenticado = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Hubo un error' });
    }
};