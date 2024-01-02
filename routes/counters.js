const express = require('express');
const router = express.Router();
const counters = require('../services/counters');

/* GET organizations */
router.get('/', async function (req, res, next) {
    try {
        res.json(await counters.getDashboardCounts(req.query.page));
    } catch (err) {
        console.error(`Error while getting dashboard counters `, err.message);
        next(err);
    }
});

module.exports = router;