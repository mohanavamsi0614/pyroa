require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const mongo = process.env.MONGO_DB;
const port = 5009;


const userRouter = require('./router');

app.use(express.json());
app.use(cors({
    origin:["http://localhost:5173","http://localhost:5009","https://pyros.onrender.com","https://golden-seahorse-64b42e.netlify.app","https://legendary-starburst-c5d285.netlify.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));


app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use('/api/users', userRouter);


const connectDB = async () => {
    try {
        await mongoose.connect(mongo); // Removed deprecated options
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit the application if unable to connect
    }
};


connectDB();


app.listen(port, () => {
    console.log(`Server connected successfully on port ${port}`);
});
