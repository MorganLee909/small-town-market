const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    unit: String,
    quantity: Number,
    description: String
});

module.exports = mongoose.model("Item", ItemSchema);