const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    county: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    description: String,
    items: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }
});

module.exports = mongoose.model("Vendor", VendorSchema);