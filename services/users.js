const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function getUserRoles() {
    const rows = await db.query(
        `SELECT * FROM user_roles`
    );

    const data = helper.emptyOrRows(rows);
    return data;
}

async function getUser(user_details) {
    const rows = await db.query(
        `SELECT
            firstname, lastname, email, roleID
        FROM
            users
        WHERE
            email = '${user_details.email}' AND password_hash = '${user_details.password_hash}'    
        `
    );

    const data = helper.emptyOrRows(rows);
    console.log(rows)
    return data;
}

async function createUser(user_details) {
    var created = new Date
    created.toLocaleString

    const result = await db.query(
        `INSERT INTO users (
            firstname, lastname, email, roleID, password_hash, created) 
        VALUES (
            '${user_details.firstname}', '${user_details.lastname}', '${user_details.email}',
            '${user_details.roleID}', '${user_details.password_hash}', '${created}'
        )`
    );

    let message = 'Error in creating user';

    if (result.affectedRows) {
        message = 'User created successfully';
    }

    return { message };
}

module.exports = {
    getUserRoles,
    createUser,
    getUser
}