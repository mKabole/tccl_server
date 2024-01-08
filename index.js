const express = require("express");
const app = express();
const path = require('path');
const cors = require('cors');

const loansRouter = require("./routes/loans");
const usersRouter = require("./routes/users");
const banksRouter = require("./routes/banks");
const receiptsRouter = require("./routes/receipts");
const clientsRouter = require("./routes/clients");
const countersRouter = require("./routes/counters");
const organizationsRouter = require("./routes/organizations");
const uploadRouter = require("./routes/upload");
const paymentsRouter = require("./routes/payments");
const authRouter = require("./routes/auth");

const hostname = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// Use the cors middleware with appropriate options
app.use(cors({
    // origin: 'http://localhost:5173',
    origin: 'https://tccl.onrender.com/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Allow cookies and credentials to be sent
}));

// Serve files from the 'files' directory
app.use('/files', express.static(path.join(__dirname, 'files')));

app.get("/", (req, res) => {
    res.json({ message: "ok" });
});

app.use("/banks", banksRouter.router);
app.use("/loans", loansRouter);
app.use("/users", usersRouter.router);
app.use("/receipts", receiptsRouter);
app.use("/clients", clientsRouter.router);
app.use("/counters", countersRouter);
app.use("/organizations", organizationsRouter.router);
app.use("/upload", uploadRouter);
app.use("/payments", paymentsRouter);
app.use("/auth", authRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({ message: err.message });
    return;
});

app.listen(port, () => {
    console.log(`Example app listening at http://${hostname}:${port}`);
});
