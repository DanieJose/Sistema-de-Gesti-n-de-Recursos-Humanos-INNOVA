const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../../uploads/documentos');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `doc-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

router.post('/registrar', upload.single('archivo'), (req, res) => {
    const db = req.app.get('db');
    const { empleado_id, titulo, tipo, creadoPor } = req.body;
    let archivo_url = null;
    
    if (req.file) {
        archivo_url = `/uploads/documentos/${req.file.filename}`;
    }

    const query = `
        INSERT INTO documentos (empleado_id, titulo, tipo, archivo_url, creadoPor, modificadoPor)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [empleado_id, titulo, tipo || 'Documento General', archivo_url, creadoPor || 1, creadoPor || 1], (err, result) => {
        if (err) {
            console.error("Error al registrar documento:", err);
            return res.status(500).json({ error: "Error al registrar documento", detalle: err.message });
        }
        res.json({ mensaje: "Documento registrado con éxito", id: result.insertId, archivo_url });
    });
});

router.get('/empleado/:id', (req, res) => {
    const db = req.app.get('db');
    const empleado_id = req.params.id;
    
    const query = `
        SELECT d.*, 
               (SELECT nombre FROM usuarios WHERE id = d.creadoPor) AS creadoPorNombre,
               (SELECT nombre FROM usuarios WHERE id = d.modificadoPor) AS modificadoPorNombre
        FROM documentos d
        WHERE d.empleado_id = ? 
        ORDER BY d.fecha_creacion DESC
    `;
    
    db.query(query, [empleado_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener documentos', detalle: err.message });
        }
        res.json(results);
    });
});

router.put('/:id', upload.single('archivo'), (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { titulo, tipo, modificadoPor } = req.body;
    
    let archivo_url = null;
    if (req.file) {
        archivo_url = `/uploads/documentos/${req.file.filename}`;
    }

    if (archivo_url) {
        const query = `
            UPDATE documentos SET
                titulo = ?, 
                tipo = ?, 
                archivo_url = ?, 
                modificadoPor = ?
            WHERE id = ?
        `;
        db.query(query, [titulo, tipo || 'Documento General', archivo_url, modificadoPor || 1, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error al actualizar documento", detalle: err.message });
            res.json({ mensaje: "Documento actualizado con éxito" });
        });
    } else {
        const query = `
            UPDATE documentos SET
                titulo = ?, 
                tipo = ?, 
                modificadoPor = ?
            WHERE id = ?
        `;
        db.query(query, [titulo, tipo || 'Documento General', modificadoPor || 1, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error al actualizar documento", detalle: err.message });
            res.json({ mensaje: "Documento actualizado con éxito" });
        });
    }
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    const query = "DELETE FROM documentos WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar documento", detalle: err.message });
        }
        res.json({ mensaje: "Documento eliminado con éxito" });
    });
});

module.exports = router;
