const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const db = req.app.get('db');
    db.query("SELECT * FROM categorias_legales ORDER BY nombre ASC", (err, results) => {
        if (err) return res.status(500).json({ error: "Error al obtener categorías", detalle: err.message });
        res.json(results);
    });
});

router.post('/', (req, res) => {
    const db = req.app.get('db');
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    db.query("INSERT INTO categorias_legales (nombre) VALUES (?)", [nombre], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "La categoría ya existe" });
            }
            return res.status(500).json({ error: "Error al crear categoría", detalle: err.message });
        }
        res.json({ mensaje: "Categoría creada", id: result.insertId, nombre });
    });
});

router.put('/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    db.query("UPDATE categorias_legales SET nombre = ? WHERE id = ?", [nombre, id], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: "Ya existe una categoría con ese nombre" });
            }
            return res.status(500).json({ error: "Error al actualizar", detalle: err.message });
        }
        res.json({ mensaje: "Categoría actualizada" });
    });
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;

    db.query("DELETE FROM categorias_legales WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Error al eliminar", detalle: err.message });
        res.json({ mensaje: "Categoría eliminada" });
    });
});

module.exports = router;
