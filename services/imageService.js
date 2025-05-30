const Image = require('../models/imagemodel');

const saveImage = async (file) => {
    // file.key is the S3 key, file.location is the S3 URL (from multer-s3)
    const img = new Image({
        filename: file.key,
        url: file.location,
        reviews: [],
    });
    return await img.save();
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

module.exports = {
    saveImage,
    getAllImages,
    addReview,
    getImageByFilename,
};
