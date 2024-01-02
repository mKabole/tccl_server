const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const loans = require('../services/loans');
const jwt = require('jsonwebtoken');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class Loan extends Model { }
Loan.init({
    userID: DataTypes.INTEGER,
    contract_date: DataTypes.DATE,
    clientID: DataTypes.INTEGER,
    organizationID: DataTypes.INTEGER,
    bankID: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    interest_percentage: DataTypes.FLOAT,
    statusID: DataTypes.FLOAT,
    loan_term: DataTypes.INTEGER,
    cycle: DataTypes.INTEGER,
    payslip_url1: DataTypes.STRING,
    payslip_url2: DataTypes.STRING,
    is_topup: DataTypes.BOOLEAN,
    loan_topped_up: DataTypes.INTEGER,
    initial_amount: DataTypes.FLOAT,
    topup_amount: DataTypes.FLOAT,
    outright_settlement: DataTypes.BOOLEAN,
    outright_settlement_amount: DataTypes.FLOAT,
    outright_settlement_date: DataTypes.DATE,
    has_default: DataTypes.BOOLEAN,
    default_months: DataTypes.INTEGER
}, { sequelize, modelName: 'loan_details' });

class LoanStatus extends Model { }
LoanStatus.init({
    status: DataTypes.STRING
    
}, { sequelize, modelName: 'loan_status' });
// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const loan = await Loan.create(req.body);
    res.json(loan);
});

router.post('/status', async (req, res) => {
    const status = await LoanStatus.create(req.body);
    res.json(status);
});

router.put('/:id', async (req, res) => {
    const loan = await Loan.findByPk(req.params.id);
    if (loan) {
        await Loan.update(req.body);
        res.json(loan);
    } else {
        res.status(404).json({ message: 'Loan not found' });
    }
});

router.delete('/:id', async (req, res) => {
    const loan = await Loan.findByPk(req.params.id);
    if (loan) {
        await Loan.destroy();
        res.json({ message: 'Loan deleted' });
    } else {
        res.status(404).json({ message: 'Loan not found' });
    }
});

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



/* POST topup loan details */
router.post('/topup', async function (req, res, next) {
    try {
        res.json(await loans.createTopup(req.body));
    } catch (err) {
        console.error(`Error while adding topup loan details`, err.message);
        next(err);
    }
});



/* POST loan details */
// router.post('/', async function (req, res, next) {
//     try {
//         res.json(await loans.create(req.body));
//     } catch (err) {
//         console.error(`Error while adding loan details`, err.message);
//         next(err);
//     }
// });

/* PUT loan details */
// router.put('/:id', async function (req, res, next) {
//     try {
//         res.json(await loans.update(req.params.id, req.body));
//     } catch (err) {
//         console.error(`Error while updating loan details`, err.message);
//         next(err);
//     }
// });

/* DELETE loan details */
// router.delete('/:id', async function (req, res, next) {
//     try {
//         res.json(await loans.remove(req.params.id));
//     } catch (err) {
//         console.error(`Error while deleting loan details`, err.message);
//         next(err);
//     }
// });

module.exports = router;