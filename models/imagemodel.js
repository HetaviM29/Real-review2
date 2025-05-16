const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: String,
    review: String,
});

const Image = mongoose.model('Image' , imageSchema);
module.exports = Image;