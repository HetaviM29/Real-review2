const Image = require('../models/imagemodel');

const saveImage = async (filename) => {
    const image = new Image({ filename, review: '' });
    await image.save();
    return image;
};

const getAllImages = async () => {
    return await Image.find();
};

const addReview = async (filename, review) => {
    return await Image.findOneAndUpdate({ filename }, { review }, { new: true });
};

const getImageByFilename = async (filename) => {
    return await Image.findOne({ filename });
};

module.exports = {
    saveImage,
    getAllImages,
    addReview,
    getImageByFilename
};
