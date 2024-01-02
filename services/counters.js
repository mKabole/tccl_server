const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.sqlite');

async function getDashboardCounts() {
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT
                (SELECT COUNT(*) FROM clients) AS client_count,
                (SELECT COUNT(*) FROM organizations) AS organization_count,
                COUNT(*) AS loan_count
            FROM
                loan_details
            WHERE
                statusID BETWEEN 1 AND 4`,
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    const data = helper.emptyOrRows([row]);
                    resolve(data);
                }
            }
        );
    });
}

module.exports = {
    getDashboardCounts
}