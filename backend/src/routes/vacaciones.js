const express = require('express');
const router = express.Router();

router.post('/registrar', (req, res) => {
    const db = req.app.get('db');
    const {
        empleado_id,
        fechaIngreso,
        aniosLaborados,
        diasCorrespondientesEmpleado,
        fechaSolicitud,
        tipoSolicitud,
        periodo,
        diasCorrespondientes,
        diasVacaciones,
        diasPagados,
        diasPendientes,
        fechaInicio,
        fechaFinal,
        fechaRegreso,
        observaciones,
        autorizadoPor,
        usuario_id // For audit
    } = req.body;

    if (!empleado_id) {
        return res.status(400).json({ error: 'El ID del empleado es requerido' });
    }

    const query = `
        INSERT INTO vacaciones (
            empleado_id, 
            fechaIngreso, 
            aniosLaborados, 
            diasCorrespondientes, 
            fechaSolicitud, 
            tipoSolicitud, 
            periodo, 
            diasVacaciones, 
            diasPagados, 
            diasPendientes, 
            fechaInicio, 
            fechaFinal, 
            fechaRegreso, 
            observaciones, 
            autorizadoPor,
            creadoPor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Note: The table has 'diasCorrespondientes' but the form has both 'diasCorrespondientesEmpleado' and 'diasCorrespondientes' (periodo). Let's save the periodo one into diasCorrespondientes.
    db.execute(query, [
        empleado_id,
        fechaIngreso || null,
        aniosLaborados || 0,
        diasCorrespondientes || 0,
        fechaSolicitud || null,
        tipoSolicitud || null,
        periodo || null,
        diasVacaciones || 0,
        diasPagados || 0,
        diasPendientes || 0,
        fechaInicio || null,
        fechaFinal || null,
        fechaRegreso || null,
        observaciones || null,
        autorizadoPor || null,
        usuario_id || null
    ], (err, result) => {
        if (err) {
            console.error("❌ ERROR DETALLADO:", err);
            return res.status(500).json({ error: "Error al registrar vacaciones", detalle: err.message });
        }
        res.json({ mensaje: "Vacaciones registradas con éxito", id: result.insertId });
    });
});

router.get('/empleado/:id', (req, res) => {
    const db = req.app.get('db');
    const empleado_id = req.params.id;
    
    const query = `
        SELECT v.*, 
               (SELECT nombre FROM usuarios WHERE id = v.creadoPor) AS creadoPorNombre,
               (SELECT nombre FROM usuarios WHERE id = v.modificadoPor) AS modificadoPorNombre
        FROM vacaciones v
        WHERE v.empleado_id = ? 
        ORDER BY v.fechaInicio DESC
    `;
    
    db.query(query, [empleado_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener vacaciones', detalle: err.message });
        }
        res.json(results);
    });
});

router.put('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    const {
        fechaIngreso,
        aniosLaborados,
        diasCorrespondientes,
        fechaSolicitud,
        tipoSolicitud,
        periodo,
        diasVacaciones,
        diasPagados,
        diasPendientes,
        fechaInicio,
        fechaFinal,
        fechaRegreso,
        observaciones,
        autorizadoPor,
        usuario_id // For audit
    } = req.body;

    const query = `
        UPDATE vacaciones SET
            fechaIngreso = ?, 
            aniosLaborados = ?, 
            diasCorrespondientes = ?, 
            fechaSolicitud = ?, 
            tipoSolicitud = ?, 
            periodo = ?, 
            diasVacaciones = ?, 
            diasPagados = ?, 
            diasPendientes = ?, 
            fechaInicio = ?, 
            fechaFinal = ?, 
            fechaRegreso = ?, 
            observaciones = ?, 
            autorizadoPor = ?,
            modificadoPor = ?
        WHERE id = ?
    `;

    db.execute(query, [
        fechaIngreso || null,
        aniosLaborados || 0,
        diasCorrespondientes || 0,
        fechaSolicitud || null,
        tipoSolicitud || null,
        periodo || null,
        diasVacaciones || 0,
        diasPagados || 0,
        diasPendientes || 0,
        fechaInicio || null,
        fechaFinal || null,
        fechaRegreso || null,
        observaciones || null,
        autorizadoPor || null,
        usuario_id || null,
        id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al actualizar vacaciones", detalle: err.message });
        }
        res.json({ mensaje: "Vacaciones actualizadas con éxito" });
    });
});

router.delete('/:id', (req, res) => {
    const db = req.app.get('db');
    const id = req.params.id;
    
    const query = "DELETE FROM vacaciones WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Error al eliminar vacaciones", detalle: err.message });
        }
        res.json({ mensaje: "Vacaciones eliminadas con éxito" });
    });
});

module.exports = router;
