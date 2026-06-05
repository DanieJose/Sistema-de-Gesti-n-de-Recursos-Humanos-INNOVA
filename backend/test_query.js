const mysql = require('mysql2');
const db = mysql.createConnection({ host: 'localhost', port: 3306, user: 'root', password: '', database: 'sistema_rrhh' });
const sql = `
SELECT 
    (SELECT COUNT(*) FROM empleados) as total,
    (SELECT COUNT(*) FROM empleados WHERE estado = 1) as activos,
    (SELECT COUNT(*) FROM empleados WHERE estado = 0) as inactivos,
    (SELECT COUNT(*) FROM tickets WHERE estado = 'Pendiente') as tickets,
    (SELECT COUNT(*) FROM departamentos) as categorias,
    (SELECT COUNT(*) FROM empleados WHERE MONTH(fecha_nacimiento) = MONTH(CURRENT_DATE)) as cumpleaneros,
    (SELECT COUNT(*) FROM contratos c1 WHERE c1.id IN (SELECT max_id FROM (SELECT MAX(id) AS max_id FROM contratos GROUP BY empleado_id) AS sub) AND c1.fechaFinal BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 30 DAY)) as vencimientos,
    (SELECT COUNT(*) FROM vacaciones WHERE estado = 'Aprobada' AND CURRENT_DATE BETWEEN fecha_inicio AND fecha_fin) as de_vacaciones,
    (SELECT COUNT(*) FROM faltas WHERE MONTH(fecha_falta) = MONTH(CURRENT_DATE) AND YEAR(fecha_falta) = YEAR(CURRENT_DATE)) as faltas_mes,
    (SELECT COUNT(*) FROM documentos_legales) as doc_legales
FROM DUAL;`;
db.query(sql, (err, results) => {
    if (err) {
        console.error("FULL ERROR:", err);
    } else {
        console.log("RESULTS:", results);
    }
    process.exit(0);
});
