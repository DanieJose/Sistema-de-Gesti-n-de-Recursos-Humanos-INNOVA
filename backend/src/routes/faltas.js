const express = require('express');
const router = express.Router();

router.post('/registrar', (req, res) => {
    const db = req.app.get('db');
    const { empleado_id, fecha, motivo, sancion, creadoPor } = req.body;

    const query = `
        INSERT INTO faltas (empleado_id, fecha, motivo, sancion, creadoPor, modificadoPor)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [empleado_id, fecha, motivo, sancion || null, creadoPor || 1, creadoPor || 1], (err, result) => {
        if (err) {
            console.error("Error al registrar falta:", err);
            return res.status(500).json({ error: "Error al registrar falta", detalle: err.message });
        }
        res.json({ mensaje: "Falta registrada con éxito", id: result.insertId });
    });
});

router.get('/empleado/:id', (req, res) => {
    const db = req.app.get('db');
    const empleado_id = req.params.id;
    
    const query = `
        SELECT f.*, 
               (SELECT nombre FROM usuarios WHERE id = f.creadoPor) AS creadoPorNombre,
               (SELECT nombre FROM usuarios WHERE id = f.modificadoPor) AS modificadoPorNombre
        FROM faltas f
        WHERE f.empleado_id = ? 
        ORDER BY f.fecha DESC
    `;
    
    db.query(query, [empleado_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener faltas', detalle: err.message });
        }
        res.json(results);
    });
});

router.put('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { fecha, motivo, sancion, modificadoPor } = req.body;

    const query = `
        UPDATE faltas SET
            fecha = ?, 
            motivo = ?, 
            sancion = ?,
            modificadoPor = ?
        WHERE id = ?
    `;

    db.query(query, [fecha, motivo, sancion || null, modificadoPor || 1, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar falta", detalle: err.message });
        }
        res.json({ mensaje: "Falta actualizada con éxito" });
    });
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    const query = "DELETE FROM faltas WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar falta", detalle: err.message });
        }
        res.json({ mensaje: "Falta eliminada con éxito" });
    });
});

module.exports = router;
