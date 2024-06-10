const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

router.get('/', async (req, res) => {
    const { destination, startDate, endDate, guests } = req.query;

    console.log('Arama kriterleri:', { destination, startDate, endDate, guests });

    try {
       
        const hotels = await Hotel.find({ location: destination });
        console.log('Bulunan oteller:', hotels);
        const hotelIds = hotels.map(hotel => hotel._id);

       
        const rooms = await Room.find({
            hotel: { $in: hotelIds },
            startDate: { $lte: new Date(startDate) },
            endDate: { $gte: new Date(endDate) },
            status: 'Bos',
            guests: { $gte: parseInt(guests, 10) }
        }).populate('hotel');

        console.log('Bulunan odalar:', rooms);
        res.send(rooms);
    } catch (error) {
        console.error('Arama hatası:', error);
        res.status(500).send('Error fetching search results');
    }
});

module.exports = router;
