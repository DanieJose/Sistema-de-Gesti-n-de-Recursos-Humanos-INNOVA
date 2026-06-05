const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importación de rutas externas
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const empleadoRoutes = require('./routes/empleados');
const vacacionesRoutes = require('./routes/vacaciones');
const departamentosRoutes = require('./routes/departamentos');
const faltasRoutes = require('./routes/faltas');
const notasRoutes = require('./routes/notas');
const documentosRoutes = require('./routes/documentos');
const logsRoutes = require('./routes/logs');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes = require('./routes/usuarios');
const bibliotecaRoutes = require('./routes/biblioteca');
const documentosLegalesRoutes = require('./routes/documentos-legales');
const categoriasLegalesRoutes = require('./routes/categorias-legales');

const app = express();

// --- CONFIGURACIÓN DE MIDDLEWARES ---
app.use(express.json()); 
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Configuración de CORS para el puerto del Frontend (3001)
app.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// --- CONEXIÓN A LA BASE DE DATOS ---
const db = mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'sistema_rrhh',
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('❌ ERROR MYSQL: ', err.message);
    } else {
        console.log('✅ Base de Datos MySQL conectada');
    }
});

// Compartir la conexión con los archivos de rutas
app.set('db', db);

// --- DEFINICIÓN DE RUTAS API ---

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/vacaciones', vacacionesRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/faltas', faltasRoutes);
app.use('/api/notas', notasRoutes);
app.use('/api/documentos', documentosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/biblioteca', bibliotecaRoutes);
app.use('/api/documentos-legales', documentosLegalesRoutes);
app.use('/api/categorias-legales', categoriasLegalesRoutes);
app.use('/api/logs', logsRoutes);

// 1. OBTENER MENÚ DINÁMICO (Rutas corregidas)
app.get('/api/menu/:rol_id', (req, res) => {
    const { rol_id } = req.params;
    
    // MENÚ BASE
    let menu = [
        { nombre: 'Dashboard', ruta: '/', icono: '🏠' }
    ];

    // MÓDULOS DE RECURSOS HUMANOS
    if (rol_id == 1 || rol_id == 2) {
        menu.push({ nombre: 'RECURSOS HUMANOS', esCabecera: true });
        menu.push(
            { nombre: 'Empleados', ruta: '/empleados', icono: '👥' },
            { nombre: 'Nuevo Empleado', ruta: '/empleados/nuevo', icono: '👤+' },
            { nombre: 'Registrar Vacaciones', ruta: '/vacaciones', icono: '🏖️' },
            { nombre: 'Reportes', ruta: '/reportes', icono: '📊' },
            { nombre: 'Departamentos', ruta: '/departamentos', icono: '🏢' }
        );
        
        // As per request, Gestión Manuales under RECURSOS HUMANOS
        if (rol_id == 1) {
            menu.push({ nombre: 'Gestión Manuales', ruta: '/admin/manuales', icono: '📚' });
            menu.push({ nombre: 'Documentos Legales', ruta: '/documentos-legales', icono: '📁' });
        }
    }

    // MÓDULOS DE IT
    let itItems = [];
    
    // Tickets is now under IT for everyone
    itItems.push({ nombre: 'Tickets', ruta: '/tickets', icono: '🎫' });
    
    if (rol_id == 1 || rol_id == 2) {
        itItems.push({ nombre: 'Control Usuarios y Roles', ruta: '/admin/usuarios', icono: '🔐' });
    }
    if (rol_id == 1) {
        itItems.push({ nombre: 'Logs de Sistema', ruta: '/admin/logs', icono: '📋' });
    }

    if (itItems.length > 0) {
        menu.push({ nombre: 'Departamento de IT', esCabecera: true });
        menu = menu.concat(itItems);
    }

    res.json(menu);
});

// 2. ESTADÍSTICAS PARA LAS TARJETAS DEL DASHBOARD
app.get('/api/stats/resumen', (req, res) => {
    const sql = `
        SELECT 
            (SELECT COUNT(*) FROM empleados) as total,
            (SELECT COUNT(*) FROM empleados WHERE estado = 1) as activos,
            (SELECT COUNT(*) FROM empleados WHERE estado = 0) as inactivos,
            (SELECT COUNT(*) FROM tickets WHERE estado = 'Pendiente') as tickets,
            (SELECT COUNT(*) FROM departamentos) as categorias,
            (SELECT COUNT(*) FROM empleados WHERE MONTH(fecha_nacimiento) = MONTH(CURRENT_DATE)) as cumpleaneros,
            (SELECT COUNT(*) FROM contratos c1 WHERE c1.id IN (SELECT max_id FROM (SELECT MAX(id) AS max_id FROM contratos GROUP BY empleado_id) AS sub) AND c1.fechaFinal BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)) as vencimientos,
            (SELECT COUNT(*) FROM vacaciones WHERE CURRENT_DATE BETWEEN fechaInicio AND fechaFinal) as de_vacaciones,
            (SELECT COUNT(*) FROM faltas WHERE MONTH(fecha) = MONTH(CURRENT_DATE) AND YEAR(fecha) = YEAR(CURRENT_DATE)) as faltas_mes,
            (SELECT COUNT(*) FROM documentos_legales) as doc_legales
        FROM DUAL;
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results[0]);
    });
});

app.get('/api/stats/empleados-por-departamento', (req, res) => {
    const sql = `
        SELECT d.nombre as departamento, COUNT(e.id) as cantidad
        FROM departamentos d
        LEFT JOIN empleados e ON d.id = e.departamento_id AND e.estado = 1
        GROUP BY d.id, d.nombre
        ORDER BY cantidad DESC;
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/api/stats/dashboard-lists', (req, res) => {
    const lists = {};
    let pending = 4;
    const checkDone = (err) => {
        if (err && pending > 0) {
            pending = -1;
            return res.status(500).json({ error: err.message });
        }
        pending--;
        if (pending === 0) res.json(lists);
    };

    // 1. Cumpleañeros
    let cumplesQuery = "SELECT id, nombre, apellido, fecha_nacimiento, foto FROM empleados WHERE MONTH(fecha_nacimiento) = MONTH(CURRENT_DATE) AND estado = 1 ORDER BY DAY(fecha_nacimiento)";
    let cumplesParams = [];
    
    if (req.query.mes && !isNaN(req.query.mes)) {
        cumplesQuery = "SELECT id, nombre, apellido, fecha_nacimiento, foto FROM empleados WHERE MONTH(fecha_nacimiento) = ? AND estado = 1 ORDER BY DAY(fecha_nacimiento)";
        cumplesParams = [req.query.mes];
    }

    db.query(cumplesQuery, cumplesParams, (err, results) => {
        if (!err) lists.cumpleaneros = results;
        checkDone(err);
    });

    // 2. Vencimientos de contratos
    let vencimientosQuery = "SELECT c.id, e.id as empleado_id, e.nombre, e.apellido, e.foto, c.fechaFinal, c.tipoContrato FROM contratos c JOIN empleados e ON c.empleado_id = e.id WHERE c.id IN (SELECT max_id FROM (SELECT MAX(id) AS max_id FROM contratos GROUP BY empleado_id) AS sub) AND c.fechaFinal BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY) AND e.estado = 1 ORDER BY c.fechaFinal ASC";
    let vencimientosParams = [];

    if (req.query.mesVencimiento === 'todos') {
        vencimientosQuery = "SELECT c.id, e.id as empleado_id, e.nombre, e.apellido, e.foto, c.fechaFinal, c.tipoContrato FROM contratos c JOIN empleados e ON c.empleado_id = e.id WHERE c.id IN (SELECT max_id FROM (SELECT MAX(id) AS max_id FROM contratos GROUP BY empleado_id) AS sub) AND e.estado = 1 ORDER BY c.fechaFinal ASC";
    } else if (req.query.mesVencimiento && !isNaN(req.query.mesVencimiento)) {
        vencimientosQuery = "SELECT c.id, e.id as empleado_id, e.nombre, e.apellido, e.foto, c.fechaFinal, c.tipoContrato FROM contratos c JOIN empleados e ON c.empleado_id = e.id WHERE c.id IN (SELECT max_id FROM (SELECT MAX(id) AS max_id FROM contratos GROUP BY empleado_id) AS sub) AND MONTH(c.fechaFinal) = ? AND e.estado = 1 ORDER BY c.fechaFinal ASC";
        vencimientosParams = [req.query.mesVencimiento];
    }

    db.query(vencimientosQuery, vencimientosParams, (err, results) => {
        if (!err) lists.vencimientos = results;
        checkDone(err);
    });

    // 3. Empleados activos
    db.query("SELECT id, nombre, apellido, codigo_empleado, foto FROM empleados WHERE estado = 1 ORDER BY nombre, apellido", (err, results) => {
        if (!err) lists.activos = results;
        checkDone(err);
    });

    // 4. Empleados inactivos
    db.query("SELECT id, nombre, apellido, codigo_empleado, foto FROM empleados WHERE estado = 0 ORDER BY nombre, apellido", (err, results) => {
        if (!err) lists.inactivos = results;
        checkDone(err);
    });
});

// 3. SISTEMA DE NOTIFICACIONES
app.get('/api/notificaciones/:usuario_id', (req, res) => {
    const { usuario_id } = req.params;
    const sql = `
        SELECT id, titulo, mensaje, leido, 
        CASE 
            WHEN TIMESTAMPDIFF(MINUTE, fecha_creacion, NOW()) < 60 THEN CONCAT('Hace ', TIMESTAMPDIFF(MINUTE, fecha_creacion, NOW()), ' min')
            WHEN TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()) < 24 THEN CONCAT('Hace ', TIMESTAMPDIFF(HOUR, fecha_creacion, NOW()), ' h')
            ELSE CONCAT('Hace ', TIMESTAMPDIFF(DAY, fecha_creacion, NOW()), ' d')
        END as tiempo
        FROM notificaciones WHERE usuario_id = ? ORDER BY fecha_creacion DESC LIMIT 10
    `;
    db.query(sql, [usuario_id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.put('/api/notificaciones/leer/:usuario_id', (req, res) => {
    const sql = 'UPDATE notificaciones SET leido = 1 WHERE usuario_id = ?';
    db.query(sql, [req.params.usuario_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ mensaje: "Leídas" });
    });
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, () => {
    console.log(`🚀 Servidor RRHH Innova en: http://localhost:${PORT}`);
});