const express = require('express');
const router = express.Router();
const loans = require('../services/users');
const jwt = require('jsonwebtoken');

/* GET loans */
router.get('/user-roles', async function (req, res, next) {
    try {
        res.json(await loans.getUserRoles(req.query.page));
    } catch (err) {
        console.error(`Error while getting user roles `, err.message);
        next(err);
    }
});

/* Create User */
router.post('/register', async function (req, res, next) {
    try {
        res.json(await loans.createUser(req.body));
    } catch (err) {
        console.error(`Error creating user `, err.message);
        next(err);
    }
});

/* login User */
router.post('/login', async function (req, res, next) {
    try {
        res.json(await loans.getUser(req.body));
    } catch (err) {
        console.log(`Invalid email or password `, err.message);
        next(err);
    }
});



module.exports = router;