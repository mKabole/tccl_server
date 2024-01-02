// const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite')

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);

    return new Promise((resolve, reject) => {
        db.all(
            `SELECT
                o.id,
                o.name,
                o.address,
                o.phone,
                o.grz,
                COUNT(DISTINCT c.id) AS clients,
                COUNT(DISTINCT ld.id) AS loans
            FROM
                organizations o
            LEFT JOIN
                clients c ON o.id = c.organizationID
            LEFT JOIN
                loan_details ld ON c.id = ld.clientID
            GROUP BY
                o.id
            LIMIT
                ?
            OFFSET
                ?`,
            [config.listPerPage, offset],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const data = helper.emptyOrRows(rows);
                    const meta = { page };
                    resolve({ data, meta });
                }
            }
        );
    });
}

// async function getMultiple(page = 1) {
//     const offset = helper.getOffset(page, config.listPerPage);
//     const rows = await db.query(
//         `SELECT
//             o.id,
//             o.name,
//             o.address,
//             o.phone,
//             o.grz,
//             COUNT(DISTINCT c.id) AS clients,
//             COUNT(DISTINCT ld.id) AS loans
//         FROM
//             organizations o
//         LEFT JOIN
//             clients c ON o.id = c.organizationID
//         LEFT JOIN
//             loan_details ld ON c.id = ld.clientID
//         GROUP BY
//             o.id
//         LIMIT
//             ${offset},${config.listPerPage}`
//     );
//     const data = helper.emptyOrRows(rows);
//     const meta = { page };

//     return {
//         data,
//         meta
//     }
// };

// async function getAll() {
//     const offset = helper.getOffset(page, config.listPerPage);
//     const rows = await db.query(
//         `SELECT * FROM organizations`
//     );
//     const data = helper.emptyOrRows(rows);

//     return data;

// };

// async function create(organization_details) {
//     let created = new Date().toISOString().slice(0, 10)

//     const result = await db.query(
//         `INSERT INTO organizations (
//             name, address, phone, grz, created) 
//         VALUES (
//             '${organization_details.name}', '${organization_details.address}', ${organization_details.phone},
//             '${organization_details.grz}', '${created}'
//         )`
//     );

//     let message = 'Error in adding organization details';

//     if (result.affectedRows) {
//         message = 'Organization details added successfully';
//     }

//     return { message };
// }

module.exports = {
    getMultiple,
}