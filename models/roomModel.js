const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: Number,
        required
    },
    message: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }]
})