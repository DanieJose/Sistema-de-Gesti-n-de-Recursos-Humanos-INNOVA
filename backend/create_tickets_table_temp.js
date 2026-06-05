const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sistema_rrhh'
});

const sql = `
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT DEFAULT NULL,
    empleado_id INT DEFAULT NULL,
    identidad VARCHAR(50) DEFAULT NULL,
    Categoria VARCHAR(100) DEFAULT NULL,
    descripcion TEXT,
    tema VARCHAR(255) DEFAULT NULL,
    prioridad ENUM('Baja','Media','Alta') DEFAULT 'Media',
    archivo VARCHAR(255) DEFAULT NULL,
    estado VARCHAR(50) DEFAULT 'Pendiente',
    asignado_usuario_id INT DEFAULT NULL,
    asignado_empleado_id INT DEFAULT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

db.query(sql, (err) => {
    if (err) console.error('Error:', err);
    else console.log('Created tickets table successfully');
    db.end();
});
