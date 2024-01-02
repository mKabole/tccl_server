const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.sqlite')

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);

    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                b.*,
                c.firstname AS clientFirstname,
                c.lastname AS clientLastname,
                o.name AS organizationName
            FROM
                bank_details AS b
            JOIN
                clients AS c ON b.clientID = c.id
            JOIN
                organizations AS o ON c.organizationID = o.id
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

async function getClientBanks(client_id) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                b.*, c.firstname, c.lastname, o.name AS organizationName
            FROM
                bank_details AS b
            JOIN
                clients AS c ON b.clientID = c.id
            JOIN
                organizations AS o ON c.organizationID = o.id
            WHERE
                b.clientID = ?`,
            [client_id],
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


module.exports = {
    getMultiple,
    getClientBanks
}