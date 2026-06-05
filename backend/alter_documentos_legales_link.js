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
ALTER TABLE documentos_legales
ADD COLUMN link_web VARCHAR(255) NULL;
`;

db.query(query, (err, results) => {
    if (err) {
        console.error('Error altering table:', err.message);
    } else {
        console.log('Column link_web added successfully.');
    }
    db.end();
});
