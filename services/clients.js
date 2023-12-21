const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT
            clients.*,
            organizations.name AS organizationName
        FROM
            clients
        JOIN
            organizations
        ON
            clients.organizationID = organizations.id
        LIMIT
            ${offset},${config.listPerPage}`
    );
    const data = helper.emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta
    }
};

async function getClient(id) {
    const rows = await db.query(
        `SELECT
            clients.*,
            organizations.name AS organizationName
        FROM
            clients
        JOIN
            organizations
        ON
            clients.organizationID = organizations.id
        WHERE
            clients.id = ${id}`
    );
    const data = helper.emptyOrRows(rows);

    return data;
};

async function getOrganizationClients(org_id) {
    const rows = await db.query(
        `SELECT
            clients.*,
            organizations.name
        FROM
            clients
        JOIN
            organizations
        ON
            clients.organizationID = organizations.id
        WHERE
            clients.organizationID = ${org_id}`
    );
    const data = helper.emptyOrRows(rows);

    return data;
};

async function create(client_details) {
    let created = new Date().toISOString().slice(0, 10)

    const result = await db.query(
        `INSERT INTO clients (
            firstname, lastname, address, employment_address, date_of_birth, photo_url, email, phone, next_of_kin,
             nrc, nrc_url, employee_no, organizationID, created) 
        VALUES (
            '${client_details.firstname}', '${client_details.lastname}', '${client_details.address}', '${client_details.employment_address}',
            '${client_details.date_of_birth}', '${client_details.photo_url}','${client_details.email}', 
            '${client_details.phone}', '${client_details.next_of_kin}', '${client_details.nrc}', '${client_details.nrc_url}',
            '${client_details.employee_no}', ${client_details.organizationID}, '${created}'
        )`
    );

    let message = 'Error in adding client details';

    if (result.affectedRows) {
        message = 'Client details added successfully';
    }

    return { message };
}

module.exports = {
    getMultiple,
    getOrganizationClients,
    create,
    getClient
}