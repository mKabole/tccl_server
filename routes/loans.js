const express = require('express');
const router = express.Router();
const loans = require('../services/loans');

/* GET loans */
router.get('/', async function (req, res, next) {
    try {
        res.json(await loans.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting loans `, err.message);
        next(err);
    }
});

/* GET new loans */
router.get('/new', async function (req, res, next) {
    try {
        res.json(await loans.getNewLoans(req.query.page));
    } catch (err) {
        console.error(`Error while getting loans `, err.message);
        next(err);
    }
});

/* GET settled loans */
router.get('/settled', async function (req, res, next) {
    try {
        res.json(await loans.getSettledLoans(req.query.page));
    } catch (err) {
        console.error(`Error while getting loans `, err.message);
        next(err);
    }
});

/* GET arrrears */
router.get('/arrears', async function (req, res, next) {
    try {
        res.json(await loans.getLoanArrears(req.query.page));
    } catch (err) {
        console.error(`Error while getting loans `, err.message);
        next(err);
    }
});

/* GET all loans */
router.get('/all', async function (req, res, next) {
    try {
        res.json(await loans.getAll(req.query.page));
    } catch (err) {
        console.error(`Error while getting loans `, err.message);
        next(err);
    }
});

/* GET loan status */
router.get('/status', async function (req, res, next) {
    try {
        res.json(await loans.getStatuses(req.query.page));
    } catch (err) {
        console.error(`Error while getting loan status `, err.message);
        next(err);
    }
});

/* GET client's loan by  client id */
router.get('/client/:id', async function (req, res, next) {
    try {
        res.json(await loans.getClientLoans(req.params.id));
    } catch (err) {
        console.error(`Error while getting loan details `, err.message);
        next(err);
    }
});

/* GET loan by id */
router.get('/loan/:id', async function (req, res, next) {
    try {
        res.json(await loans.getOne(req.params.id));
    } catch (err) {
        console.error(`Error while getting loan details `, err.message);
        next(err);
    }
});

/* POST loan details */
router.post('/', async function (req, res, next) {
    try {
        res.json(await loans.create(req.body));
    } catch (err) {
        console.error(`Error while adding loan details`, err.message);
        next(err);
    }
});

/* POST topup loan details */
router.post('/topup', async function (req, res, next) {
    try {
        res.json(await loans.createTopup(req.body));
    } catch (err) {
        console.error(`Error while adding topup loan details`, err.message);
        next(err);
    }
});

/* PUT loan details */
router.put('/:id', async function (req, res, next) {
    try {
        res.json(await loans.update(req.params.id, req.body));
    } catch (err) {
        console.error(`Error while updating loan details`, err.message);
        next(err);
    }
});

/* DELETE loan details */
router.delete('/:id', async function (req, res, next) {
    try {
        res.json(await loans.remove(req.params.id));
    } catch (err) {
        console.error(`Error while deleting loan details`, err.message);
        next(err);
    }
});

module.exports = router;