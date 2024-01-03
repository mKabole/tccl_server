const express = require('express');
const router = express.Router();
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
// const loans = require('../services/users');
const jwt = require('jsonwebtoken');

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class User extends Model { }
User.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    roleID: DataTypes.INTEGER,
    password: DataTypes.STRING
}, { sequelize, modelName: 'users' });

class Roles extends Model { }
Roles.init({
    role: DataTypes.STRING
}, { sequelize, modelName: 'user_roles' })

// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)

})

//User Roles
router.get('/user-roles', async (req, res) => {
    const roles = await Roles.findAll();
    res.json(roles);
});

router.post('/user-roles', async (req, res) => {
    const role = await Roles.create(req.body)
    res.json(role)
})

module.exports = {
    router,
    User
}