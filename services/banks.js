const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
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
        LIMIT
            ${offset},${config.listPerPage}
        `
    )

    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
}

async function getClientBanks(client_id) {

    const rows = await db.query(
        `SELECT
            b.*, c.firstname, c.lastname, o.name AS organizationName
        FROM
            bank_details AS b
        JOIN
            clients AS c ON b.clientID = c.id
        JOIN
            organizations AS o ON c.organizationID = o.id
        WHERE
            b.clientID = ${client_id}
        `
    )

    const data = helper.emptyOrRows(rows);

    return data;
}

async function create(bank_details) {
    let created = new Date().toISOString().slice(0, 10)

    const result = await db.query(
        `INSERT INTO bank_details (
            clientID, bank, account_no, account_name, branch,
             swift_code, created) 
        VALUES (
            ${bank_details.clientID}, '${bank_details.bank}', ${bank_details.account_no}, '${bank_details.account_name}', 
            '${bank_details.branch}', '${bank_details.swift_code}', '${created}'
        )`
    );

    let message = 'Error in adding bank details';

    if (result.affectedRows) {
        message = 'Bank details added successfully';
    }

    return { message };
}

module.exports = {
    getMultiple,
    getClientBanks,
    create,
}