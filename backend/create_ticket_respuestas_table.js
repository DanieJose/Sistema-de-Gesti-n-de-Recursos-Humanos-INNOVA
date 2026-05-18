require('dotenv').config();
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos.');

    const sql = `
        CREATE TABLE IF NOT EXISTS ticket_respuestas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ticket_id INT NOT NULL,
            usuario_id INT DEFAULT NULL,
            empleado_id INT DEFAULT NULL,
            mensaje TEXT NOT NULL,
            archivo VARCHAR(255) DEFAULT NULL,
            fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
            FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL
        )
    `;

    connection.query(sql, (err, result) => {
        if (err) throw err;
        console.log('Tabla ticket_respuestas creada o ya existía.');
        connection.end();
    });
});
