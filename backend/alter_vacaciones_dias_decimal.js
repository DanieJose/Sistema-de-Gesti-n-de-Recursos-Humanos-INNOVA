const sequelize = require('./src/config/database');

async function alterTable() {
    try {
        console.log('Iniciando alteración de la tabla vacaciones...');
        
        await sequelize.query(`
            ALTER TABLE vacaciones 
            MODIFY diasCorrespondientes DECIMAL(5,1), 
            MODIFY diasVacaciones DECIMAL(5,1), 
            MODIFY diasPagados DECIMAL(5,1), 
            MODIFY diasPendientes DECIMAL(5,1);
        `);
        
        console.log('✅ Columnas de días modificadas a DECIMAL(5,1) exitosamente');
    } catch (error) {
        console.error('❌ Error al alterar la tabla:', error);
    } finally {
        await sequelize.close();
    }
}

alterTable();