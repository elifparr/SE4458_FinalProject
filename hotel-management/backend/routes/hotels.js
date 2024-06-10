const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const auth = require('../middleware/auth');


router.post('/add', auth, async (req, res) => {
    const { name, location, imageUrl, rating, price, lat, lng } = req.body;

    try {
        const hotel = new Hotel({
            name,
            location,
            imageUrl,
            rating,
            price,
            lat,
            lng
        });

        await hotel.save();
        res.status(201).send(hotel);
    } catch (error) {
        console.error('Error adding hotel:', error);
        res.status(400).send('Error adding hotel');
    }
});


router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).send('Otel bulunamadı');
        }
        res.send(hotel);
    } catch (error) {
        console.error('Otel detayları alınırken hata oluştu:', error);
        res.status(500).send('Otel detayları alınırken hata oluştu');
    }
});


router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.json(hotels);
    } catch (error) {
        console.error('Oteller alınırken hata oluştu:', error);
        res.status(500).send('Oteller alınırken hata oluştu');
    }
});

module.exports = router;
