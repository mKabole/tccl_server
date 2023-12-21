const express = require('express');
const router = express.Router();
const clients = require('../services/clients');

/* GET organizations */
router.get('/', async function (req, res, next) {
    try {
        res.json(await clients.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting clients list `, err.message);
        next(err);
    }
});

router.get('/organization/:id', async function (req, res, next) {
    try {
        res.json(await clients.getOrganizationClients(req.params.id));
    } catch (err) {
        console.error(`Error while getting clients list `, err.message);
        next(err);
    }
});

router.get('/client/:id', async function (req, res, next) {
    try {
        res.json(await clients.getClient(req.params.id));
    } catch (err) {
        console.error(`Error while getting clients details `, err.message);
        next(err);
    }
});

/* POST bank details */
router.post('/', async function (req, res, next) {
    try {
        res.json(await clients.create(req.body));
    } catch (err) {
        console.error(`Error while adding client's details`, err.message);
        next(err);
    }
});

module.exports = router;