const express = require('express');
const csv = require('csv-parser');
const multer = require('multer');
const fs = require('fs');
const db = require('../services/db');
const { v4: uuidv4 } = require('uuid');
const receipts = require('../services/receipts');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
    const created = new Date().toISOString().slice(0, 10)

    // Parse the CSV data using csv-parser and insert it into the database
    const results = [];
    csvData
        .split('\n')
        .slice(1) // Skip the header row if present
        .forEach((row) => {
            const [NRCNo, TotalK] = row.split(',');

            // Insert data into the database using your MySQL connection
            db.query(
                `INSERT INTO payments
                    (batch_no, nrc, total, created)
                VALUES
                    (?, ?, ?, ?)`,
                [
                    batchId, NRCNo, TotalK, created
                ],
                (err, result) => {
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

    // Respond with a success message or any additional processing you need to do
    res.send('CSV data uploaded and processed.');
});



module.exports = router;