const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sistema_rrhh'
});

db.query("ALTER TABLE tickets MODIFY COLUMN estado VARCHAR(50) DEFAULT 'Pendiente'", (err, res) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Columna estado modificada con éxito');
    }
    db.end();
});
