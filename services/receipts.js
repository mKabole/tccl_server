const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getBatches(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT
            batch_no, created, COUNT(*) AS row_count
        FROM
            payments
        GROUP BY
            batch_no, created
        ORDER BY
            created DESC
        LIMIT
            ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getAllByBatchId(batchId) {
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
    getAllByBatchId
}