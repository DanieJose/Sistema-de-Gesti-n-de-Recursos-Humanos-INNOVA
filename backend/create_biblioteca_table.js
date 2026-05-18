const sequelize = require('./src/config/database');

const run = async () => {
    try {
        await sequelize.query(`
            CREATE TABLE IF NOT EXISTS biblioteca (
                id INT AUTO_INCREMENT PRIMARY KEY,
                titulo VARCHAR(255) NOT NULL,
                archivo VARCHAR(255) NOT NULL,
                fechaSubida DATETIME DEFAULT CURRENT_TIMESTAMP,
                subidoPor INT NOT NULL
            )
        `);
        console.log('Table biblioteca created successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
