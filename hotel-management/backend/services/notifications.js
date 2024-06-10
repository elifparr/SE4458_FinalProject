
const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');

const QUEUE_NAME = 'reservations';


const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'elifp.se4458@gmail.com',
    pass: 'C.17070002014'
  }
});

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(QUEUE_NAME, {
      durable: true
    });

    console.log(`Waiting for messages in ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      const reservation = JSON.parse(msg.content.toString());
      console.log(`Received reservation: ${msg.content.toString()}`);

     
      const hotel = await Hotel.findById(reservation.hotelId);
      const room = await Room.findById(reservation.roomId);

      const mailOptions = {
        from: 'elifp.se4458@gmail.com',
        to: 'elifp.se4458@gmail.com',
        subject: 'New Reservation',
        text: `New reservation made for ${hotel.name}, Room: ${room.roomType}, Guests: ${reservation.guests}, Dates: ${reservation.startDate} to ${reservation.endDate}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Email error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });

      channel.ack(msg);
    });
  });
});
