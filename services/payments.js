const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getMultiple(loan_id) {
    const rows = await db.query(
        `SELECT
            lp.* , ld.id 
        FROM
            loan_payments AS lp
        JOIN
            loan_details AS ld ON lp.loanID = ld.id
        WHERE
            lp.loanId = ${loan_id}`
    );
    const data = helper.emptyOrRows(rows);

    return data;
}

async function createOne(payment_details) {
    var created = new Date
    created.toLocaleString

    const result = await db.query(
        `INSERT INTO loan_payments (
            loanID, amount, date, created) 
        VALUES (
            '${payment_details.loan_id}', '${payment_details.amount}', '${created}', '${created}'
        )`
    );

    let message = 'Error in adding payment details';

    if (result.affectedRows) {
        message = 'payment details added successfully';
    }

    return { message };
}

async function createMultiple(payment_details) {
    var created = new Date
    created.toLocaleString

    console.log(payment_details.batch_no)

    const result = await db.query(
        `INSERT INTO loan_payments
            (loanID, amount, date, created)
        SELECT
            ld.id, p.total, CURDATE(), CURDATE()
        FROM
            payments AS p
        LEFT JOIN
            clients AS c ON c.nrc = p.nrc
        LEFT JOIN
            loan_details AS ld ON ld.clientID = c.id
        WHERE
            p.batch_no = "${payment_details.batch_no}"
        AND
            c.nrc = p.nrc
        AND
            ld.statusID BETWEEN 1 AND 3;`
    );

    let message = 'Error in adding payment details';

    if (result.affectedRows) {
        message = 'payment details added successfully';
    }

    return { message };
}



module.exports = {
    getMultiple,
    createOne,
    createMultiple
}