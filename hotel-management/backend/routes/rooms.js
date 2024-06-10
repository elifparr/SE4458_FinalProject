const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');


router.post('/', auth, async (req, res) => {
    const { hotel, roomType, startDate, endDate, guests, status } = req.body;

    console.log('Gelen Oda Verileri:');
    console.log('Hotel:', hotel);
    console.log('Room Type:', roomType);
    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);
    console.log('Guests:', guests);
    console.log('Status:', status);

    try {
        const room = new Room({
            hotel,
            roomType,
            startDate,
            endDate,
            guests,
            status
        });

        await room.save();
        res.status(201).send(room);
    } catch (error) {
        console.error('Error adding room:', error);
        res.status(400).send('Error adding room');
    }
});

module.exports = router;
