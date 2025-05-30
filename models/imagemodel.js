const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true }, // S3 key
    reviews: [String],
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;