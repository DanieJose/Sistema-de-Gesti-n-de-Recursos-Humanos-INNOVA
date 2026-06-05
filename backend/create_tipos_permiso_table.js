const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3307,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASS || '',
            database: process.env.DB_NAME || 'sistema_rrhh'
        });

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS tipos_permiso (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(255) NOT NULL UNIQUE
            )
        `);
        console.log('Tabla tipos_permiso creada o ya existía.');

        const defaultTipos = ['Médico', 'Personal', 'Maternidad/Paternidad', 'Luto'];
        
        for (const tipo of defaultTipos) {
            await conn.execute('INSERT IGNORE INTO tipos_permiso (nombre) VALUES (?)', [tipo]);
        }

        // Insert distinct types from vacaciones if they exist
        const [rows] = await conn.execute("SELECT DISTINCT tipoPermiso FROM vacaciones WHERE tipoPermiso IS NOT NULL AND tipoPermiso != '' AND tipoPermiso != 'Otro'");
        for (const row of rows) {
            await conn.execute('INSERT IGNORE INTO tipos_permiso (nombre) VALUES (?)', [row.tipoPermiso]);
        }

        console.log('Datos iniciales insertados.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

run();
