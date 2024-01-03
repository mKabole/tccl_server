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
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,

                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id
            ORDER BY
                ld.createdAt DESC
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

async function getClientLoans(clientId, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);

    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id
            WHERE
                ld.clientID = ?
            LIMIT ?
            OFFSET ?`,
            [clientId, config.listPerPage, offset ],
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

async function getOne(id) {
    return new Promise((resolve, reject) => {
        database.get(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.photo_url AS client_photo,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id
            WHERE
                ld.id = ?`,
            [id],
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

async function getStatuses() {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM loan_status`, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const data = helper.emptyOrRows(rows);
                resolve(data);
            }
        });
    });
}


async function createTopup(loan_details) {

    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO loan_details (
                contract_date, clientID, bankID, organizationID, amount,
                interest_percentage, cycle, is_topup, loan_topped_up,
                initial_amount, topup_amount, statusID, payslip_url1,
                payslip_url2
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                loan_details.contract_date,
                loan_details.clientID,
                loan_details.bankID,
                loan_details.organizationID,
                loan_details.amount,
                loan_details.interest_percentage,
                loan_details.cycle,
                loan_details.is_topup,
                loan_details.loan_topped_up,
                loan_details.initial_amount,
                loan_details.topup_amount,
                loan_details.statusID,
                loan_details.payslip_url1,
                loan_details.payslip_url2
            ],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    const message =
                        this.changes > 0
                            ? 'Loan details added successfully'
                            : 'Error in adding loan details';
                    resolve({ message });
                }
            }
        );
    });
}

async function getNewLoans() {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id
            WHERE
                strftime('%d', ld.contract_date) >= '06'
                AND (
                    (
                        strftime('%m', ld.contract_date) = strftime('%m', 'now')
                        AND strftime('%Y', ld.contract_date) = strftime('%Y', 'now')
                        AND strftime('%d', ld.contract_date) <= '05'
                    )
                    OR
                    (
                        strftime('%m', ld.contract_date) = strftime('%m', 'now', '+1 month')
                        AND strftime('%Y', ld.contract_date) = strftime('%Y', 'now', '+1 month')
                        AND strftime('%d', ld.contract_date) <= '05'
                    )
                )`,
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

async function getSettledLoans() {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id
            WHERE
                ld.outright_settlement = 1`,
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


async function getLoanArrears() {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id`,
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

async function getAll() {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                ld.*,
                u.firstname AS user_firstname, u.lastname AS user_lastname,
                c.firstname AS client_firstname, c.lastname AS client_lastname, c.email AS client_mail, c.phone AS client_phone,
                b.bank, b.account_no, b.account_name, b.branch, b.swift_code, ls.status, o.name AS organization_name
            FROM
                loan_details AS ld
            LEFT JOIN
                users AS u ON ld.userID = u.id
            LEFT JOIN
                clients AS c ON ld.clientID = c.id
            LEFT JOIN
                bank_details AS b ON ld.bankID = b.id
            LEFT JOIN
                loan_statuses AS ls ON ld.statusID = ls.id
            LEFT JOIN
                organizations AS o ON ld.organizationID = o.id`,
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
    getClientLoans,
    getOne,
    getStatuses,
    getNewLoans,
    getSettledLoans,
    getLoanArrears,
    getAll,
    createTopup
}