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
CREATE TABLE IF NOT EXISTS categorias_legales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);
`;

const insertQuery = `
INSERT IGNORE INTO categorias_legales (nombre) VALUES 
('Contratos'), ('Políticas'), ('Normativas'), ('Actas'), ('General');
`;

db.query(query, (err, results) => {
    if (err) {
        console.error('Error creating table:', err.message);
        db.end();
        return;
    }
    console.log('Table categorias_legales created successfully.');
    
    db.query(insertQuery, (err2, res2) => {
        if (err2) {
            console.error('Error inserting defaults:', err2.message);
        } else {
            console.log('Default categories inserted.');
        }
        db.end();
    });
});
