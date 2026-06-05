require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'sistema_rrhh'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to DB:', err);
        process.exit(1);
    }
    console.log('Connected to DB.');
    
    connection.query("SHOW COLUMNS FROM faltas LIKE 'documento'", (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            connection.query("ALTER TABLE faltas ADD COLUMN documento VARCHAR(255) DEFAULT NULL", (err, result) => {
                if (err) throw err;
                console.log('Column "documento" added to "faltas" table.');
                process.exit(0);
            });
        } else {
            console.log('Column "documento" already exists in "faltas" table.');
            process.exit(0);
        }
    });
});
