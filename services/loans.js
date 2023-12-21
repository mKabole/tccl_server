const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.default_months,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        ORDER BY
            ld.created DESC
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

async function getClientLoans(clientId, page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.arrears_pm, ld.arrears_charged, ld.arrears_due, ld.arrears_ad, ld.default_months,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        WHERE
            ld.clientID = ${clientId}
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

async function getOne(id) {
    // const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.outright_settlement, ld.outright_settlement_amount, ld.outright_settlement_date, ld.has_arrears,
            ld.has_default, ld.default_months, ld.created, ld.organizationID, ld.payslip_url1, ld.payslip_url2, ld.contract_date,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        WHERE
            ld.id=${id}`
    );
    const data = helper.emptyOrRows(rows);
    // const meta = { page };

    return data;
}

async function getStatuses() {
    const rows = await db.query(
        `SELECT * FROM loan_status`
    );

    const data = helper.emptyOrRows(rows);
    return data;
}

async function create(loan_details) {
    var created = new Date
    created.toLocaleString

    const result = await db.query(
        `INSERT INTO loan_details (
            contract_date, clientID, bankID, organizationID, amount, interest_percentage, cycle,
            statusID, payslip_url1, payslip_url2, created) 
        VALUES (
            '${loan_details.contract_date}', '${loan_details.clientID}', '${loan_details.bankID}','${loan_details.organizationID}',
            '${loan_details.amount}', '${loan_details.interest_percentage}', '${loan_details.cycle}', '${loan_details.statusID}',
            '${loan_details.payslip_url1}', '${loan_details.payslip_url2}', '${created}'
        )`
    );

    let message = 'Error in adding loan details';

    if (result.affectedRows) {
        message = 'Loan details added successfully';
    }

    return { message };
}

async function createTopup(loan_details) {
    let created = new Date()

    const result = await db.query(
        `INSERT INTO loan_details (
            contract_date, clientID, bankID, organizationID, amount,
            interest_percentage, cycle, is_topup, loan_topped_up,
            initial_amount, topup_amount, statusID, payslip_url1,
            payslip_url2, created
        ) 
        VALUES (
            '${loan_details.contract_date}', '${loan_details.clientID}', '${loan_details.bankID}','${loan_details.organizationID}','${loan_details.amount}',
            '${loan_details.interest_percentage}', '${loan_details.cycle}', '${loan_details.is_topup}', '${loan_details.loan_topped_up}',
            '${loan_details.initial_amount}', '${loan_details.topup_amount}', '${loan_details.statusID}', '${loan_details.payslip_url1}',
            '${loan_details.payslip_url2}', '${loan_details.created}'
        )`
    );

    let message = 'Error in adding loan details';

    if (result.affectedRows) {
        message = 'Loan details added successfully';
    }

    return { message };
}

async function update(id, loan_details) {

    var created = new Date
    created.toLocaleString

    let query = 'UPDATE loan_details SET ';

    // Check which field you want to update
    if (loan_details.contract_date) {
        query += `contract_date = "${loan_details.contract_date}", `;
    }

    if (loan_details.bankID) {
        query += `bankID = ${loan_details.bankID}, `;
    }

    if (loan_details.amount) {
        query += `amount = ${loan_details.amount}, `;
    }

    if (loan_details.full_installment) {
        query += `full_installment = ${loan_details.full_installment}, `;
    }

    if (loan_details.cumulative_totals) {
        query += `cumulative_totals = ${loan_details.cumulative_totals}, `;
    }

    if (loan_details.due_date) {
        query += `due_date = "${loan_details.due_date}", `;
    }

    if (loan_details.amount_paid) {
        query += `amount_paid = ${loan_details.amount_paid}, `;
    }

    if (loan_details.statusID) {
        query += `statusID = ${loan_details.statusID}, `;
    }

    if (loan_details.monthly_deduction) {
        query += `monthly_deduction = ${loan_details.monthly_deduction}, `;
    }

    if (loan_details.cycle) {
        query += `cycle = "${loan_details.cycle}", `;
    }

    if (loan_details.total_collectible) {
        query += `total_collectible = ${loan_details.total_collectible}, `;
    }

    if (loan_details.interest_paid) {
        query += `interest_paid = ${loan_details.interest_paid}, `;
    }

    if (loan_details.capital_ball_paid) {
        query += `capital_ball_paid = ${loan_details.capital_ball_paid}, `;
    }

    if (loan_details.capital_bo) {
        query += `capital_bo = ${loan_details.capital_bo}, `;
    }

    if (loan_details.outright_settlement) {
        query += `outright_settlement = ${loan_details.outright_settlement}, `;
    }

    if (loan_details.outright_settlement_amount) {
        query += `outright_settlement_amount = ${loan_details.outright_settlement_amount}, `;
    }

    if (loan_details.outright_settlement_date) {
        query += `outright_settlement_date = '${loan_details.outright_settlement_date}', `;
    }

    if (loan_details.arrears_ad) {
        query += `arrears_ad = ${loan_details.arrears_ad}, `;
    }

    if (loan_details.default_months) {
        query += `default_months = ${loan_details.default_months}, `;
    }

    // Remove the trailing comma and add the WHERE clause
    query = query.slice(0, -2); // Removes the last two characters (", ") added in the loop
    query += ` WHERE id = ${id}`;

    const result = await db.query(query);

    let message = 'Error in updating loan details';

    if (result.affectedRows) {
        message = 'Loan details updated successfully';
    }

    return { message };
}

async function remove(id) {
    const result = await db.query(
        `DELETE FROM loan_details WHERE id=${id}`
    );

    let message = 'Error in deleting loan details';

    if (result.affectedRows) {
        message = 'loan details deleted successfully';
    }

    return { message };
}

async function getNewLoans() {
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.default_months,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        WHERE DAY(ld.contract_date) >= 6
            AND (
                (
                    MONTH(ld.contract_date) = MONTH(CURDATE())
                    AND YEAR(ld.contract_date) = YEAR(CURDATE())
                    AND DAY(ld.contract_date) <= 5
                )
                OR
                (
                    MONTH(ld.contract_date) = MONTH(DATE_ADD(CURDATE(), INTERVAL 1 MONTH))
                    AND YEAR(ld.contract_date) = YEAR(DATE_ADD(CURDATE(), INTERVAL 1 MONTH))
                    AND DAY(ld.contract_date) <= 5
                )
            )`
    );
    const data = helper.emptyOrRows(rows);

    return data
}

async function getSettledLoans() {
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.outright_settlement, ld.outright_settlement_amount, ld.outright_settlement_date, ld.default_months,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        WHERE ld.outright_settlement = 1`
    );
    const data = helper.emptyOrRows(rows);

    return data
}

async function getLoanArrears() {
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.outright_settlement, ld.outright_settlement_amount, ld.outright_settlement_date, ld.has_arrears, ld.default_months,
            ld.arrears_charged, ld.arrears_pm, ld.arrears_due, ld.arrears_ad,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id
        LEFT JOIN
            arrears AS a ON ld.id = a.loanID
        WHERE ld.has_arrears = 1`
    );
    const data = helper.emptyOrRows(rows);

    return data
}

async function getAll() {
    const rows = await db.query(
        `SELECT
            ld.id, ld.userID, ld.contract_date, ld.clientID, ld.bankID, ld.amount, ld.interest_percentage, ld.interest_amount,
            ld.full_installment, ld.cumulative_totals, ld.due_date, ld.amount_paid, ld.statusID, ld.monthly_deduction,
            ld.loan_term, ld.cycle, ld.total_collectible, ld.interest_paid, ld.capital_ball_paid, ld.capital_bo,
            ld.default_months, ld.arrears_charged, ld.arrears_pm, ld.arrears_due, ld.arrears_ad,

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
            loan_status AS ls ON ld.statusID = ls.id
        LEFT JOIN
            organizations AS o ON ld.organizationID = o.id`
    );
    const data = helper.emptyOrRows(rows);

    return data
}




module.exports = {
    getMultiple,
    getClientLoans,
    getOne,
    getStatuses,
    create,
    update,
    remove,
    getNewLoans,
    getSettledLoans,
    getLoanArrears,
    getAll,
    createTopup
}