const express = require('express');
const csv = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');
const { Sequelize, Model, DataTypes } = require('sequelize');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const database = new sqlite3.Database('database.sqlite');
const receipts = require('../services/receipts');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Sequelize instance
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

// Define User model
class Payment extends Model { }
Payment.init({
    batch_no: DataTypes.STRING,
    nrc: DataTypes.STRING,
    total: DataTypes.FLOAT,
    paidFor: DataTypes.BOOLEAN
}, { sequelize, modelName: 'payments' });


// Sync models with database
sequelize.sync();

// Middleware for parsing request body
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/* GET receipts */
router.get('/', async function (req, res, next) {
    try {
        res.json(await receipts.getBatches(req.query.page));
    } catch (err) {
        console.error(`Error while getting receipts `, err.message);
        next(err);
    }
});

/* Get receipts by batch id */
router.get('/batch/:batch_no', async function (req, res, next) {
    try {
        res.json(await receipts.getAllByBatchId(req.params.batch_no));
    } catch (err) {
        console.error(`Error while getting batch of receipts`, err.message);
        next(err);
    }
});

//Upload receipts from csv file
router.post('/upload', upload.single('csvFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const csvData = req.file.buffer.toString('utf8');
    const batchId = uuidv4();
    const results = [];

    csvData
        .split('\n')
        .slice(1) // Skip the header row if present
        .forEach((row) => {
            const [NRCNo, TotalK] = row.split(',');

            database.run(
                `INSERT INTO payments
                    (batch_no, nrc, total, paidFor)
                VALUES
                    (?, ?, ?, ?)`,
                [batchId, NRCNo, TotalK, false],
                (err) => {
                    if (err) {
                        console.error('Error inserting data:', err);
                    }
                }
            );

            results.push({
                NRCNo,
                TotalK,
            });
        });

    console.log('CSV data processed and ready for database insertion:', results);
    res.send('CSV data uploaded and processed.');
});



module.exports = router;