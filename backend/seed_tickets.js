const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sistema_rrhh'
});

const sql = `
INSERT INTO tickets (usuario_id, empleado_id, identidad, Categoria, descripcion, tema, prioridad, estado) 
VALUES 
(1, 1, '0801-1990-12345', 'Soporte Técnico', 'Problema con la computadora', 'Hardware', 'Alta', 'Pendiente'),
(2, 2, '0801-1992-54321', 'Recursos Humanos', 'Solicitud de vacaciones', 'Vacaciones', 'Media', 'En Proceso'),
(1, 3, '0801-1989-98765', 'Administración', 'Falta de suministros', 'Suministros', 'Baja', 'Resuelto')
`;

db.query(sql, (err) => {
    if (err) console.error('Error:', err);
    else console.log('Inserted dummy tickets successfully');
    db.end();
});
