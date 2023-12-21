const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getDashboardCounts() {
    const rows = await db.query(
        `SELECT
            (SELECT COUNT(*) FROM clients) AS client_count,
            (SELECT COUNT(*) FROM organizations) AS organization_count,
            COUNT(*) AS loan_count
        FROM
            loan_details
        WHERE
            statusID BETWEEN 1 AND 4`
    );

    const data = helper.emptyOrRows(rows);
    return data;
}

module.exports = {
    getDashboardCounts
}