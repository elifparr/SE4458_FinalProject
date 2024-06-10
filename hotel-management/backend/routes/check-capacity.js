const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'elifp.se4458@gmail.com',
    pass: 'C.1707000214'
  }
});

router.get('/check-capacity', async (req, res) => {
  try {
    const rooms = await Room.find({ status: 'Bos' });
    const capacityMap = {};

    rooms.forEach(room => {
      const hotelId = room.hotel.toString();
      if (!capacityMap[hotelId]) {
        capacityMap[hotelId] = 0;
      }
      capacityMap[hotelId] += room.guests;
    });

    for (const hotelId in capacityMap) {
      if (capacityMap[hotelId] < 20) {
        const hotel = await Hotel.findById(hotelId);
        const mailOptions = {
          from: 'elifp.se4458@gmail.com',
          to: 'elifp.se4458@gmail.com',
          subject: 'Low Capacity Alert',
          text: `Hotel ${hotel.name} has a capacity below 20%. Current capacity: ${capacityMap[hotelId]}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log('Email error:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      }
    }

    res.status(200).send('Capacity check completed');
  } catch (error) {
    console.error('Capacity check error:', error);
    res.status(500).send('Capacity check failed');
  }
});

module.exports = router;
