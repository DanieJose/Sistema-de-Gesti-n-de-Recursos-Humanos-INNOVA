const sequelize = require('./src/config/database');

const run = async () => {
    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS notas (
                id INT AUTO_INCREMENT PRIMARY KEY,
                empleado_id INT NOT NULL,
                asunto VARCHAR(255) NOT NULL,
                descripcion TEXT NOT NULL,
                creadoPor INT DEFAULT 1,
                modificadoPor INT DEFAULT 1,
                fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                fechaModificacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE CASCADE
            )
        `);
        console.log('Table notas created successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
