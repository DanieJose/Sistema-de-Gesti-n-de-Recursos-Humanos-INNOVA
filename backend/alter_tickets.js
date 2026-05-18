const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', port: 3307, user: 'root', password: '', database: 'sistema_rrhh' });
db.query("ALTER TABLE tickets ADD COLUMN tema VARCHAR(255) DEFAULT NULL, ADD COLUMN prioridad ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media', ADD COLUMN archivo VARCHAR(255) DEFAULT NULL", (err, res) => {
    console.log(err || 'Columnas añadidas');
    db.end();
});
