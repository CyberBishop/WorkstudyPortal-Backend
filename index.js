const express = require('express');
const mongoose = require('mongoose');
const attendanceRoutes = require('./routes/attendacnceRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middleware to parse incoming request body as JSON
app.use(express.json());

// Configure CORS options
const corsOptions = {
    origin: [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2],
    credentials: true,
    exposedHeaders: 'Authorization',
    optionsSuccessStatus: 200,
    allowedHeaders: 'Content-Type,Authorization',
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Mount routes for attendance and user management
app.use('/api/v1', attendanceRoutes);
app.use('/api/v1', userRoutes);

// Connect to MongoDB database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

// Default route to return status message
app.all('*', (req, res) => {
    res.json({ status: 'server is running' });
});

// Start server listening after data	base connection is established
connectDB().then(() => {
    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
