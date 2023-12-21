const express = require('express');
const router = express.Router();
const banks = require('../services/banks');

/* GET banks */
router.get('/', async function (req, res, next) {
    try {
        res.json(await banks.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting banks list `, err.message);
        next(err);
    }
});

/* GET client's banks */
router.get('/client/:id', async function (req, res, next) {
    try {
        res.json(await banks.getClientBanks(req.params.id));
    } catch (err) {
        console.error(`Error while getting the client's banks list `, err.message);
        next(err);
    }
});

/* POST bank details */
router.post('/', async function (req, res, next) {
    try {
        res.json(await banks.create(req.body));
    } catch (err) {
        console.error(`Error while adding client's bank details`, err.message);
        next(err);
    }
});

module.exports = router;