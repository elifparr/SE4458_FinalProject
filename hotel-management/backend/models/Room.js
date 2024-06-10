const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    roomType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: { type: String, enum: ['Bos', 'Dolu'], required: true }
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
