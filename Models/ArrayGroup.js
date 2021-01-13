const mongoose = require("mongoose");

const UserGroupSchema = mongoose.Schema({
    userGroup: { 
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


module.exports = mongoose.model("ArrayGroup", UserGroupSchema);