const express = require('express');
const mongoose = require('mongoose');
const attendanceRoutes = require('./routes/attendacnceRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());

const corsOptions = {
    origin: [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2],
    credentials: true,
    exposedHeaders: 'Authorization',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

app.use('/api/v1', attendanceRoutes);
app.use('/api/v1', userRoutes);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

app.all('*', (req, res) => {
    res.json({ message: 'Workstudy API' });
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    });
