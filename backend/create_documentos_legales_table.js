const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST ?? 'localhost',
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? '',
    database: process.env.DB_NAME ?? 'sistema_rrhh'
});

const query = `
CREATE TABLE IF NOT EXISTS documentos_legales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    archivo VARCHAR(255) NOT NULL,
    tamano VARCHAR(50),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creado_por INT
);
`;

db.query(query, (err, results) => {
    if (err) {
        console.error('Error creating table:', err.message);
    } else {
        console.log('Table documentos_legales created successfully.');
    }
    db.end();
});
