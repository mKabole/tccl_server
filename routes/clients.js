const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const clients = require('../services/clients');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define Client model
class Client extends Model { }
Client.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    address: DataTypes.STRING,
    employment_address: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    photo_url: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    next_of_kin: DataTypes.STRING,
    nrc: DataTypes.STRING,
    nrc_url: DataTypes.STRING,
    employee_no: DataTypes.STRING,
    organizationID: DataTypes.INTEGER
}, { sequelize, modelName: 'clients' });


// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CRUD routes for Client model

router.get('/', async function (req, res, next) {
    try {
        res.json(await clients.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting clients list `, err.message);
        next(err);
    }
});


router.get('/:id', async (req, res) => {
    const client = await Client.findByPk(req.params.id);
    res.json(client);
});

router.post('/', async (req, res) => {
    const client = await Client.create(req.body);
    res.json(client);
});

router.put('/:id', async (req, res) => {
    const client = await Client.findByPk(req.params.id);
    if (client) {
        await Client.update(req.body);
        res.json(client);
    } else {
        res.status(404).json({ message: 'Client not found' });
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

// /* POST bank details */
// router.post('/', async function (req, res, next) {
//     try {
//         res.json(await clients.create(req.body));
//     } catch (err) {
//         console.error(`Error while adding client's details`, err.message);
//         next(err);
//     }
// });

module.exports = {
    router,
    Client
}