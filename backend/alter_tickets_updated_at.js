const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sistema_rrhh'
});

db.query("ALTER TABLE tickets ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", (err, res) => {
    if (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('La columna updated_at ya existe.');
        } else {
            console.error('Error:', err);
        }
    } else {
        console.log('Columna updated_at añadida con éxito');
    }
    db.end();
});
