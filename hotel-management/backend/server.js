const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const searchRoutes = require('./routes/search');
const hotelRoutes = require('./routes/hotels');
const bookRoutes = require('./routes/book'); // Eklenen satır
const checkCapacityRoutes = require('./routes/check-capacity'); // Eklenen satır
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Gelen istek: ${req.method} ${req.path}`);
    next();
});

const PORT = process.env.PORT || 3001;
mongoose.connect('mongodb://hoteldb:D5mO20iPoua1dLzXcAej6Lv8rTgRdvoMlItiNs8C8b0anXApQP5MAERpNUUoBCAakfvjzWvhMCq1ACDbSKDOYw==@hoteldb.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@hoteldb@', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Cosmos DB\'ye bağlanıldı');
        app.listen(PORT, () => {
            console.log(`Sunucu ${PORT} portunda çalışıyor`);
        });
    })
    .catch(error => console.log('DB bağlantı hatası:', error));

app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/search', searchRoutes);
app.use('/hotels', hotelRoutes);
app.use('/book', bookRoutes); 
app.use('/check-capacity', checkCapacityRoutes);
