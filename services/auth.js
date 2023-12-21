const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function create(user_details) {
    let created = new Date().toISOString().slice(0, 10)

    const hashedPassword = await bcrypt.hash(user_details.password, 10);

    const result = await db.query(
        `INSERT INTO users (
            firstname, lastname, email,
            roleID, password, created) 
        VALUES (
            '${user_details.firstname}', '${user_details.lastname}', '${user_details.email}',
            '${user_details.roleID}', '${hashedPassword}', '${created}'
        )`
    );

    let message = 'Error creating user';

    if (result.affectedRows) {
        message = 'User created successfully';
    }

    return { message };
}

module.exports = {
    create,
}