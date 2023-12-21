const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination directory where to save the files
        cb(null, path.join(__dirname, "../files"));
    },
    filename: function (req, file, cb) {
        // Define how the file should be named
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

//Upload 1 file
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    const fileUrl = `/${req.file.filename}`; // Construct the URL

    res.status(200).send(fileUrl);
});

// Upload multiple files
router.post("/multiple", upload.array("files"), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send("No files uploaded.");
    }

    const fileUrls = req.files.map((file) => `/${file.filename}`);

    res.status(200).json(fileUrls);
});

module.exports = router;