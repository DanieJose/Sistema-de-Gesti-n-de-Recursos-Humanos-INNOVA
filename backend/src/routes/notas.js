const express = require('express');
const router = express.Router();

router.post('/registrar', (req, res) => {
    const db = req.app.get('db');
    const { empleado_id, asunto, descripcion, creadoPor } = req.body;

    const query = `
        INSERT INTO notas (empleado_id, asunto, descripcion, creadoPor, modificadoPor)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [empleado_id, asunto, descripcion, creadoPor || 1, creadoPor || 1], (err, result) => {
        if (err) {
            console.error("Error al registrar nota:", err);
            return res.status(500).json({ error: "Error al registrar nota", detalle: err.message });
        }
        res.json({ mensaje: "Nota registrada con éxito", id: result.insertId });
    });
});

router.get('/empleado/:id', (req, res) => {
    const db = req.app.get('db');
    const empleado_id = req.params.id;
    
    const query = `
        SELECT n.*, 
               (SELECT nombre FROM usuarios WHERE id = n.creadoPor) AS creadoPorNombre,
               (SELECT nombre FROM usuarios WHERE id = n.modificadoPor) AS modificadoPorNombre
        FROM notas n
        WHERE n.empleado_id = ? 
        ORDER BY n.fechaCreacion DESC
    `;
    
    db.query(query, [empleado_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener notas', detalle: err.message });
        }
        res.json(results);
    });
});

router.put('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { asunto, descripcion, modificadoPor } = req.body;

    const query = `
        UPDATE notas SET
            asunto = ?, 
            descripcion = ?, 
            modificadoPor = ?
        WHERE id = ?
    `;

    db.query(query, [asunto, descripcion, modificadoPor || 1, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar nota", detalle: err.message });
        }
        res.json({ mensaje: "Nota actualizada con éxito" });
    });
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    const query = "DELETE FROM notas WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar nota", detalle: err.message });
        }
        res.json({ mensaje: "Nota eliminada con éxito" });
    });
});

module.exports = router;
