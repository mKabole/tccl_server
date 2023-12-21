const express = require('express');
const router = express.Router();
const organizations = require('../services/organizations');

/* GET organizations */
router.get('/', async function (req, res, next) {
    try {
        res.json(await organizations.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting organizations `, err.message);
        next(err);
    }
});

router.get('/all', async function (req, res, next) {
    try {
        res.json(await organizations.getAll(req.query.page));
    } catch (err) {
        console.error(`Error while getting organizations list `, err.message);
        next(err);
    }
});

/* POST organization's details */
router.post('/', async function (req, res, next) {
    try {
        res.json(await organizations.create(req.body));
    } catch (err) {
        console.error(`Error while adding organization's details`, err.message);
        next(err);
    }
});

module.exports = router;