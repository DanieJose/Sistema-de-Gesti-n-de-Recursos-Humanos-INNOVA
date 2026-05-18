const express = require('express');
const router = express.Router();

// Obtener todos los logs
router.get('/', (req, res) => {
    const db = req.app.get('db');
    const query = `
        SELECT l.*, u.nombre as usuario_nombre, u.email as usuario_correo 
        FROM logs_usuarios l
        LEFT JOIN usuarios u ON l.usuario_id = u.id
        ORDER BY l.fecha_creacion DESC
        LIMIT 500
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al obtener los logs" });
        }
        res.json(results);
    });
});

// Registrar un nuevo log (opcional, para ser usado por el frontend si lo requiere, 
// aunque lo ideal es que el backend lo llame internamente)
router.post('/registrar', (req, res) => {
    const db = req.app.get('db');
    const { usuario_id, accion, modulo, detalles, ip_address } = req.body;

    const query = `
        INSERT INTO logs_usuarios (usuario_id, accion, modulo, detalles, ip_address) 
        VALUES (?, ?, ?, ?, ?)
    `;
    
    db.query(query, [usuario_id || null, accion, modulo || null, detalles || null, ip_address || null], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al registrar el log" });
        }
        res.json({ mensaje: "Log registrado exitosamente", id: result.insertId });
    });
});

module.exports = router;
