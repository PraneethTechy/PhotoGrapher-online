const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotEnv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const photographerRoutes = require('./routes/photographerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',         // keep for local development
        'https://your-frontend.vercel.app' // add your deployed frontend
    ],
    credentials: true,
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
}));
app.use(bodyParser.json());

dotEnv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection failed", err));



app.use('/user', userRoutes);
app.use('/photographer', photographerRoutes);
app.use('/booking', bookingRoutes);
app.use('/admin', adminRoutes);

// Global error handler (should be after all routes)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



app.get('/', (req, res) => {
    res.send("<h1>Welcome to the Home Page</h1>");
});
