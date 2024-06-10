// backend/routes/book.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const queueService = require('../services/queueService'); 

router.post('/', async (req, res) => {
    const { hotelId, roomId, startDate, endDate, guests } = req.body;

    try {
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: 'Oda bulunamadı' });
        }

        room.status = 'Dolu';
        await room.save();

        const reservation = { hotelId, roomId, startDate, endDate, guests };
        queueService.sendReservation(reservation);

        res.status(200).json({ message: 'Rezervasyon başarılı', room });
    } catch (error) {
        console.error('Rezervasyon hatası:', error);
        res.status(500).json({ message: 'Rezervasyon yapılamadı', error });
    }
});

module.exports = router;
