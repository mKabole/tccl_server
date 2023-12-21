const express = require('express');
const router = express.Router();
const loans = require('../services/payments');

/* GET loan payments */
router.get('/:id', async function (req, res, next) {
    try {
        res.json(await loans.getMultiple(req.params.id));
    } catch (err) {
        console.error(`Error while getting user roles `, err.message);
        next(err);
    }
});

/* POST payment details */
router.post('/', async function (req, res, next) {
    try {
        res.json(await loans.createOne(req.body));
    } catch (err) {
        console.error(`Error while adding payment details`, err.message);
        next(err);
    }
});

/* POST payment details */
router.post('/multiple', async function (req, res, next) {
    try {
        res.json(await loans.createMultiple(req.body));
    } catch (err) {
        console.error(`Error while adding payment details`, err.message);
        next(err);
    }
});

module.exports = router;