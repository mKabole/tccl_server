const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const organizations = require('../services/organizations');


// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class Organization extends Model { }
Organization.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    grz: DataTypes.BOOLEAN
}, { sequelize, modelName: 'organizations' });


// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// CRUD routes for Organization model

router.get('/all', async (req, res) => {
    const orgs = await Organization.findAll();
    res.json(orgs);
});

router.get('/', async function (req, res, next) {
    try {
        res.json(await organizations.getMultiple(req.query.page));
    } catch (err) {
        console.error(`Error while getting organizations `, err.message);
        next(err);
    }
});

router.post('/', async (req, res) => {
    const org = await Organization.create(req.body);
    res.json(org);
});

// router.get('/all', async function (req, res, next) {
//     try {
//         res.json(await organizations.getAll(req.query.page));
//     } catch (err) {
//         console.error(`Error while getting organizations list `, err.message);
//         next(err);
//     }
// });

// /* POST organization's details */
// router.post('/', async function (req, res, next) {
//     try {
//         res.json(await organizations.create(req.body));
//     } catch (err) {
//         console.error(`Error while adding organization's details`, err.message);
//         next(err);
//     }
// });

module.exports = {
    router,
    Organization
}