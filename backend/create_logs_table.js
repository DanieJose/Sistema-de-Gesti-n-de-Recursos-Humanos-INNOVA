const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const run = async () => {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'sistema_rrhh'
        });

        await db.query(`
            CREATE TABLE IF NOT EXISTS logs_usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usuario_id INT,
                accion VARCHAR(255) NOT NULL,
                modulo VARCHAR(100),
                detalles TEXT,
                ip_address VARCHAR(45),
                fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
            )
        `);
        console.log('Table logs_usuarios created successfully');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

run();
