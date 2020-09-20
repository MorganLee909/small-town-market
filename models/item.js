const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    unit: String,
    quantity: Number,
    description: String,
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "vendor"
    }
});

module.exports = mongoose.model("Item", ItemSchema);