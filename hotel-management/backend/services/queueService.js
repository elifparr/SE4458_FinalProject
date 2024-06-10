const amqp = require('amqplib/callback_api');

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';

function sendToQueue(queue, message) {
    amqp.connect(RABBITMQ_URL, function(error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue, {
                durable: false
            });

            channel.sendToQueue(queue, Buffer.from(message));
            console.log(" [x] Sent %s", message);
        });

        setTimeout(function() {
            connection.close();
        }, 500);
    });
}

function sendReservation(reservation) {
    sendToQueue('reservations', JSON.stringify(reservation));
}

module.exports = {
    sendToQueue,
    sendReservation
};
