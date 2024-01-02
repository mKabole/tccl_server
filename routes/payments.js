const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const payments = require('../services/payments');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class LoanPayment extends Model { }
LoanPayment.init({
    loanID: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    date: DataTypes.DATE
}, { sequelize, modelName: 'loan_payments' });

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/', async (req, res) => {
    const payment = await LoanPayment.create(req.body);
    res.json(payment);
});

router.get('/', async (req, res) => {
    const payments = await LoanPayment.findAll();
    res.json(payments);
});


router.get('/:id', async function (req, res, next) {
    try {
        res.json(await payments.getMultiple(req.params.id));
    } catch (err) {
        console.error(`Error while getting user roles `, err.message);
        next(err);
    }
});

router.post('/multiple', async function (req, res, next) {
    try {
        res.json(await payments.createMultiple(req.body));
    } catch (err) {
        console.error(`Error while adding payment details`, err.message);
        next(err);
    }
});

router.delete('/:id', async (req, res) => {
    const child = await LoanPayment.findByPk(req.params.id);
    if (child) {
        await LoanPayment.destroy({
            where: {
                id: req.params.id // Assuming 'id' is the primary key of LoanPayment
            }
        });
        res.json({ message: 'Child deleted' });
    } else {
        res.status(404).json({ message: 'Child not found' });
    }
});

/* POST payment details */
// router.post('/', async function (req, res, next) {
//     try {
//         res.json(await loans.createOne(req.body));
//     } catch (err) {
//         console.error(`Error while adding payment details`, err.message);
//         next(err);
//     }
// });

module.exports = router;