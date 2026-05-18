const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: '',
    database: 'sistema_rrhh'
});

db.query("ALTER TABLE tickets ADD COLUMN asignado_usuario_id INT DEFAULT NULL, ADD COLUMN asignado_empleado_id INT DEFAULT NULL", (err, res) => {
    if (err) {
        console.error('Error:', err);
    } else {
        console.log('Columnas de asignación añadidas con éxito');
    }
    db.end();
});
