const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.sqlite')

async function getMultiple(loan_id) {
    return new Promise((resolve, reject) => {
        database.all(
            `SELECT
                lp.* , ld.id 
            FROM
                loan_payments AS lp
            JOIN
                loan_details AS ld ON lp.loanID = ld.id
            WHERE
                lp.loanId = ?
            `,
            [loan_id],
            (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    const data = helper.emptyOrRows([row]);
                    resolve(data);
                }
            }
        )
    })

}

async function createMultiple(payment_details) {
    const currentDate = new Date().toISOString().slice(0, 10);

    return new Promise((resolve, reject) => {
        database.run(
            `INSERT INTO loan_payments
                (loanID, amount, date)
            SELECT
                ld.id, p.total, ?, 
            FROM
                payments AS p
            LEFT JOIN
                clients AS c ON c.nrc = p.nrc
            LEFT JOIN
                loan_details AS ld ON ld.clientID = c.id
            WHERE
                p.batch_no = ?
            AND
                c.nrc = p.nrc
            AND
                ld.statusID BETWEEN 1 AND 3;`,
            [currentDate, payment_details.batch_no],
            (err) => {
                if (err) {
                    console.error('Error in adding payment details:', err);
                    reject(err);
                } else {
                    const message = this.changes ? 'Payment details added successfully' : 'Error in adding payment details';
                    resolve({ message });
                }
            }
        );
    });
}



module.exports = {
    getMultiple,
    createMultiple
}

// async function createOne(payment_details) {
//     var created = new Date
//     created.toLocaleString

//     const result = await db.query(
//         `INSERT INTO loan_payments (
//             loanID, amount, date, created)
//         VALUES (
//             '${payment_details.loan_id}', '${payment_details.amount}', '${created}', '${created}'
//         )`
//     );

//     let message = 'Error in adding payment details';

//     if (result.affectedRows) {
//         message = 'payment details added successfully';
//     }

//     return { message };
// }

// async function createMultiple(payment_details) {
//     var created = new Date
//     created.toLocaleString

//     const result = await db.query(
//         `INSERT INTO loan_payments
//             (loanID, amount, date, created)
//         SELECT
//             ld.id, p.total, CURDATE(), CURDATE()
//         FROM
//             payments AS p
//         LEFT JOIN
//             clients AS c ON c.nrc = p.nrc
//         LEFT JOIN
//             loan_details AS ld ON ld.clientID = c.id
//         WHERE
//             p.batch_no = "${payment_details.batch_no}"
//         AND
//             c.nrc = p.nrc
//         AND
//             ld.statusID BETWEEN 1 AND 3;`
//     );

//     let message = 'Error in adding payment details';

//     if (result.affectedRows) {
//         message = 'payment details added successfully';
//     }

//     return { message };
// }