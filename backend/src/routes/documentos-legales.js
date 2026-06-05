const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../../uploads/documentos_legales');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        cb(null, `doclegal-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.array('archivos', 10), (req, res) => {
    const db = req.app.get('db');
    const { titulo, descripcion, categoria, creado_por } = req.body;
    let links = [];
    try {
        if (req.body.links) links = JSON.parse(req.body.links);
    } catch (e) {}
    
    if ((!req.files || req.files.length === 0) && links.length === 0) {
        return res.status(400).json({ error: 'Debe subir al menos un archivo o proporcionar un link web' });
    }

    // Insert the main document (we keep archivo and link_web columns for backwards compatibility, or just leave them null)
    // To be safe we'll leave them null and rely on the child tables
    const query = `
        INSERT INTO documentos_legales (titulo, descripcion, categoria, creado_por)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [titulo, descripcion, categoria || 'General', creado_por || 1], (err, result) => {
        if (err) {
            console.error("Error al registrar documento legal:", err);
            return res.status(500).json({ error: "Error al registrar documento", detalle: err.message });
        }
        
        const docId = result.insertId;
        
        // Save files
        if (req.files && req.files.length > 0) {
            const fileValues = req.files.map(file => {
                const archivo_url = `/uploads/documentos_legales/${file.filename}`;
                const tamano = file.size > 1024 * 1024 
                    ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
                    : (file.size / 1024).toFixed(2) + ' KB';
                return [docId, archivo_url, tamano];
            });
            if (fileValues.length > 0) {
                db.query('INSERT INTO documentos_legales_archivos (documento_id, archivo_url, tamano) VALUES ?', [fileValues]);
            }
        }

        // Save links
        if (links && links.length > 0) {
            const linkValues = links.map(link => [docId, link]);
            if (linkValues.length > 0) {
                db.query('INSERT INTO documentos_legales_links (documento_id, link_url) VALUES ?', [linkValues]);
            }
        }

        res.json({ mensaje: "Documento legal registrado con éxito", id: docId });
    });
});

router.get('/', (req, res) => {
    const db = req.app.get('db');
    
    // We get all documents
    const query = `
        SELECT d.*, 
               (SELECT nombre FROM usuarios WHERE id = d.creado_por) AS creadoPorNombre
        FROM documentos_legales d
        ORDER BY d.fecha_creacion DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener documentos legales', detalle: err.message });
        }
        
        if (results.length === 0) return res.json(results);

        // Fetch all files and links for all docs
        db.query('SELECT * FROM documentos_legales_archivos', (errArchivos, archivos) => {
            db.query('SELECT * FROM documentos_legales_links', (errLinks, links) => {
                const docsMap = results.map(doc => {
                    return {
                        ...doc,
                        archivos: archivos.filter(a => a.documento_id === doc.id),
                        links: links.filter(l => l.documento_id === doc.id)
                    };
                });
                res.json(docsMap);
            });
        });
    });
});

router.put('/:id', upload.array('archivos', 10), (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const { titulo, descripcion, categoria } = req.body;
    let links = [];
    try {
        if (req.body.links) links = JSON.parse(req.body.links);
    } catch (e) {}
    
    if (!titulo) {
        return res.status(400).json({ error: 'El título es requerido' });
    }

    const updateQuery = `
        UPDATE documentos_legales 
        SET titulo = ?, descripcion = ?, categoria = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [titulo, descripcion, categoria || 'General', id], (err, result) => {
        if (err) {
            console.error("Error al actualizar documento legal:", err);
            return res.status(500).json({ error: "Error al actualizar documento", detalle: err.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Documento no encontrado" });
        }

        // Always replace all links (delete existing, insert new)
        db.query('DELETE FROM documentos_legales_links WHERE documento_id = ?', [id], () => {
            if (links && links.length > 0) {
                const linkValues = links.map(link => [id, link]);
                db.query('INSERT INTO documentos_legales_links (documento_id, link_url) VALUES ?', [linkValues]);
            }
        });

        // For files, we will append new files. 
        // We will receive a JSON string 'archivosExistentesParaEliminar' with IDs of files to delete.
        let archivosEliminar = [];
        try {
            if (req.body.archivosEliminar) archivosEliminar = JSON.parse(req.body.archivosEliminar);
        } catch (e) {}

        if (archivosEliminar.length > 0) {
            db.query('SELECT archivo_url FROM documentos_legales_archivos WHERE id IN (?)', [archivosEliminar], (errSel, toDeleteFiles) => {
                if (!errSel && toDeleteFiles) {
                    toDeleteFiles.forEach(f => {
                         const filePath = path.join(__dirname, '../../', f.archivo_url);
                         if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                    });
                }
                db.query('DELETE FROM documentos_legales_archivos WHERE id IN (?)', [archivosEliminar]);
            });
        }

        // Add new files
        if (req.files && req.files.length > 0) {
            const fileValues = req.files.map(file => {
                const archivo_url = `/uploads/documentos_legales/${file.filename}`;
                const tamano = file.size > 1024 * 1024 
                    ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' 
                    : (file.size / 1024).toFixed(2) + ' KB';
                return [id, archivo_url, tamano];
            });
            if (fileValues.length > 0) {
                db.query('INSERT INTO documentos_legales_archivos (documento_id, archivo_url, tamano) VALUES ?', [fileValues]);
            }
        }

        res.json({ mensaje: "Documento legal actualizado con éxito" });
    });
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    // Primero borrar archivos físicos
    db.query("SELECT archivo_url FROM documentos_legales_archivos WHERE documento_id = ?", [id], (err, results) => {
        if (!err && results) {
            results.forEach(row => {
                if (row.archivo_url) {
                    const filePath = path.join(__dirname, '../../', row.archivo_url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            });
        }
        
        // El documento original podría tener un archivo en la columna vieja
        db.query("SELECT archivo FROM documentos_legales WHERE id = ?", [id], (err, oldResults) => {
            if (!err && oldResults && oldResults.length > 0 && oldResults[0].archivo) {
                 const filePath = path.join(__dirname, '../../', oldResults[0].archivo);
                 if (fs.existsSync(filePath)) {
                     fs.unlinkSync(filePath);
                 }
            }
            
            // Delete record (cascades will delete child records)
            const deleteQuery = "DELETE FROM documentos_legales WHERE id = ?";
            db.query(deleteQuery, [id], (err2) => {
                if (err2) {
                    return res.status(500).json({ error: "Error al eliminar documento", detalle: err2.message });
                }
                res.json({ mensaje: "Documento legal eliminado con éxito" });
            });
        });
    });
});

module.exports = router;
