const Image = require('../models/imagemodel');
const path = require('path');
const saveImage = async (filename) => {
    const image = new Image({ filename, review: '' });
    await image.save();
    return image;
};

const getAllImages = async () => {
    return await Image.find();
};

const addReview = async (filename, review) => {
     return await Image.findOneAndUpdate(
        { filename },
        { $push: { reviews: review } },
        { new: true }
    );
};

const getImageByFilename = async (filename) => {
    return await Image.findOne({ filename });
};

const getImageFilePath = (filename) => {
    return path.join(__dirname, '..', 'public', 'images', filename);
};


module.exports = {
    saveImage,
    getAllImages,
    addReview,
    getImageByFilename,
    getImageFilePath
};
