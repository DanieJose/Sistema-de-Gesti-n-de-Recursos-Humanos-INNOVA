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
            CREATE TABLE IF NOT EXISTS documentos_legales_archivos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                documento_id INT NOT NULL,
                archivo_url VARCHAR(255) NOT NULL,
                tamano VARCHAR(50),
                FOREIGN KEY (documento_id) REFERENCES documentos_legales(id) ON DELETE CASCADE
            )
        `);

        await conn.execute(`
            CREATE TABLE IF NOT EXISTS documentos_legales_links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                documento_id INT NOT NULL,
                link_url VARCHAR(500) NOT NULL,
                FOREIGN KEY (documento_id) REFERENCES documentos_legales(id) ON DELETE CASCADE
            )
        `);
        
        // Migrate existing data
        const [docs] = await conn.execute('SELECT id, archivo, tamano, link_web FROM documentos_legales');
        for (const doc of docs) {
            if (doc.archivo) {
                const [existingArchivos] = await conn.execute('SELECT id FROM documentos_legales_archivos WHERE documento_id = ? AND archivo_url = ?', [doc.id, doc.archivo]);
                if (existingArchivos.length === 0) {
                     await conn.execute('INSERT INTO documentos_legales_archivos (documento_id, archivo_url, tamano) VALUES (?, ?, ?)', [doc.id, doc.archivo, doc.tamano]);
                }
            }
            if (doc.link_web) {
                const [existingLinks] = await conn.execute('SELECT id FROM documentos_legales_links WHERE documento_id = ? AND link_url = ?', [doc.id, doc.link_web]);
                if (existingLinks.length === 0) {
                     await conn.execute('INSERT INTO documentos_legales_links (documento_id, link_url) VALUES (?, ?)', [doc.id, doc.link_web]);
                }
            }
        }
        
        console.log('Tables created and data migrated.');
        process.exit(0);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}
run();