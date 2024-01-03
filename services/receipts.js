const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.sqlite');

async function getBatches(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);

    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                batch_no, createdAt, COUNT(*) AS row_count
            FROM
                payments
            GROUP BY
                batch_no, createdAt
            ORDER BY
                createdAt DESC
            LIMIT ?
            OFFSET ?`,
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

async function getAllByBatchId(batchId) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                p.*, c.firstname, c.lastname, o.name AS organization_name
            FROM
                payments AS p
            LEFT JOIN
                clients AS c ON p.nrc = c.nrc
            LEFT JOIN
                organizations AS o ON c.organizationID = o.id
            WHERE
                batch_no = ?
            `,
            [batchId],
            (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    const data = helper.emptyOrRows(rows);
                    resolve(data);
                }
            }
        );
    });
}


async function updateBatchItems(batchDetails) {
    const rows = await db.query(
        `SELECT
            p.*,
            c.firstname, c.lastname,
            o.name AS organization_name
        FROM
            payments AS p
        LEFT JOIN
            clients AS c ON p.nrc = c.nrc
        LEFT JOIN
            organizations AS o ON c.organizationID = o.id
        WHERE
            batch_no = '${batchId}' AND p.nrc = c.nrc
        `
    );
    const data = helper.emptyOrRows(rows);

    return data;

}



module.exports = {
    getBatches,
    getAllByBatchId,
    updateBatchItems
}