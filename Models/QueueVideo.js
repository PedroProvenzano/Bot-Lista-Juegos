const mongoose = require("mongoose");

const QueueVideoSchema = mongoose.Schema({
    queue: { 
        type: Array,
        required: true 
    },
    listName: {
        type: String,
        required: true
    },
    isOpen: {
        type: Boolean,
        required: false
    },
    date: { type: Date, default: Date.now }
});


module.exports = mongoose.model("ArrayGroup", QueueVideoSchema);