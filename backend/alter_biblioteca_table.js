const sequelize = require('./src/config/database');

const run = async () => {
    try {
        await sequelize.query(`
            ALTER TABLE biblioteca 
            ADD COLUMN categoria VARCHAR(100) AFTER titulo,
            ADD COLUMN descripcion TEXT AFTER categoria,
            ADD COLUMN tamano VARCHAR(20) AFTER descripcion;
        `);
        console.log('Table biblioteca altered successfully');
    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}
run();
