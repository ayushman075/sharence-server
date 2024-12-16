const connectDB = require('./database/dbConnect');
const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth.route');
const preferencesRouter = require('./routes/preference.route');
const detailsRouter = require('./routes/data.route');

const app = express();

dotenv.config({
    path: '.env',
});

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost",
            "http://localhost:8000",
            "https://sharence-dashboard.vercel.app",
            "https://sharence-client.vercel.app",
            "*"
        ],
        methods: ["GET", "POST", "PUT", "OPTIONS", "UPDATE", "DELETE"],
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(
    express.urlencoded({
        extended:true,
        limit:"16kb",
    })
);
app.use(express.static("public"));
app.use(cookieParser());


app.use((req, res, next) => {
    console.log('Authorization Header:', req.headers.authorization);
    next();
  });
// Route Import
app.use("/api/v1/auth", express.raw({ type: "application/json" }), authRouter);
app.use("/api/v1/preferences", preferencesRouter);
app.use("/api/v1/details",detailsRouter)
app.get("/", (req, res) => {
    res.send(
        "Welcome to Sharence, on this line you are talking to Sharence server !!"
    );
});

connectDB()
    .then(() => {
        const port = process.env.PORT || 3005;
        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.log("Error connecting to database !!", err);
    });

module.exports = app;
