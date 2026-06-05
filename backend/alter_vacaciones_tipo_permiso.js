const sequelize = require('./src/config/database');

async function addColumn() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL database via Sequelize.');

        const [results] = await sequelize.query("SHOW COLUMNS FROM vacaciones LIKE 'tipoPermiso'");
        
        if (results.length === 0) {
            await sequelize.query("ALTER TABLE vacaciones ADD COLUMN tipoPermiso VARCHAR(100) DEFAULT NULL");
            console.log('Column "tipoPermiso" added to "vacaciones" table.');
        } else {
            console.log('Column "tipoPermiso" already exists in "vacaciones" table.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await sequelize.close();
    }
}

addColumn();
