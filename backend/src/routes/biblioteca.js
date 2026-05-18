const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../../uploads/biblioteca');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `biblio-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

// Obtener todos los documentos de la biblioteca
router.get('/', (req, res) => {
    const db = req.app.get('db');
    const query = `
        SELECT b.*, 
               (SELECT nombre FROM usuarios WHERE id = b.creadoPor) AS creadoPorNombre,
               (SELECT nombre FROM usuarios WHERE id = b.modificadoPor) AS modificadoPorNombre
        FROM biblioteca b
        ORDER BY b.fechaCreacion DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener biblioteca', detalle: err.message });
        }
        res.json(results);
    });
});

// subirManual()
router.post('/subir', upload.single('archivo'), (req, res) => {
    const db = req.app.get('db');
    const { titulo, categoria, descripcion, creadoPor } = req.body;
    
    if (!req.file) {
        return res.status(400).json({ error: "El archivo es obligatorio" });
    }
    
    const archivo_url = `/uploads/biblioteca/${req.file.filename}`;
    const tamano_mb = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

    const query = `
        INSERT INTO biblioteca (titulo, categoria, descripcion, tamano, archivo, creadoPor)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [titulo, categoria || 'General', descripcion || '', tamano_mb, archivo_url, creadoPor || 1], (err, result) => {
        if (err) {
            console.error("Error al subir a biblioteca:", err);
            return res.status(500).json({ error: "Error al subir a biblioteca", detalle: err.message });
        }
        res.json({ mensaje: "Archivo subido con éxito", id: result.insertId, archivo: archivo_url });
    });
});

// eliminarManual()
router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    // Primero buscar el archivo para poder eliminarlo físicamente
    const selectQuery = "SELECT archivo FROM biblioteca WHERE id = ?";
    db.query(selectQuery, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error al buscar documento", detalle: err.message });
        }
        
        if (results.length > 0) {
            const archivo_url = results[0].archivo;
            const filepath = path.join(__dirname, '../../', archivo_url);
            
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
        }
        
        // Ahora eliminar de la base de datos
        const deleteQuery = "DELETE FROM biblioteca WHERE id = ?";
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Error al eliminar documento", detalle: err.message });
            }
            res.json({ mensaje: "Documento eliminado con éxito" });
        });
    });
});

// actualizarManual()
router.put('/:id', upload.single('archivo'), (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { titulo, categoria, descripcion, modificadoPor } = req.body;

    if (req.file) {
        // Se subió un nuevo archivo, actualizar todo incluyendo archivo y tamaño
        const archivo_url = `/uploads/biblioteca/${req.file.filename}`;
        const tamano_mb = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';

        // Opcional: Eliminar archivo anterior
        const selectQuery = "SELECT archivo FROM biblioteca WHERE id = ?";
        db.query(selectQuery, [id], (err, results) => {
            if (!err && results.length > 0) {
                const oldFilepath = path.join(__dirname, '../../', results[0].archivo);
                if (fs.existsSync(oldFilepath)) fs.unlinkSync(oldFilepath);
            }
        });

        const query = `
            UPDATE biblioteca 
            SET titulo = ?, categoria = ?, descripcion = ?, tamano = ?, archivo = ?, modificadoPor = ?, fechaModificacion = NOW()
            WHERE id = ?
        `;
        db.query(query, [titulo, categoria, descripcion, tamano_mb, archivo_url, modificadoPor, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error al actualizar manual", detalle: err.message });
            res.json({ mensaje: "Manual actualizado con éxito", archivo: archivo_url });
        });
    } else {
        // No hay archivo nuevo, actualizar solo campos de texto
        const query = `
            UPDATE biblioteca 
            SET titulo = ?, categoria = ?, descripcion = ?, modificadoPor = ?, fechaModificacion = NOW()
            WHERE id = ?
        `;
        db.query(query, [titulo, categoria, descripcion, modificadoPor, id], (err, result) => {
            if (err) return res.status(500).json({ error: "Error al actualizar manual", detalle: err.message });
            res.json({ mensaje: "Manual actualizado con éxito" });
        });
    }
});

module.exports = router;
