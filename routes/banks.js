const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const banks = require('../services/banks');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class Bank extends Model { }
Bank.init({
    clientID: DataTypes.INTEGER,
    bank: DataTypes.STRING,
    account_no: DataTypes.INTEGER,
    account_name: DataTypes.STRING,
    branch: DataTypes.STRING,
    swift_code: DataTypes.STRING,
}, { sequelize, modelName: 'bank_details' });

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CRUD routes for Organization model

router.get('/', async function (req, res, next) {
    try {
        res.json(await banks.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while adding client's bank details`, err.message);
        next(err);
    }
});

router.post('/', async (req, res) => {
    const bank = await Bank.create(req.body);
    res.json(bank);
});

router.get('/client/:id', async function (req, res, next) {
    try {
        res.json(await banks.getClientBanks(req.params.id));
    } catch (err) {
        console.error(`Error while getting the client's banks list `, err.message);
        next(err);
    }
});

module.exports = {
    router,
    Bank
}