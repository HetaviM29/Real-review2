const Image = require('../models/imagemodel');
const path = require('path');

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.render('index', {
                image: null,
                review: null,
                images: await Image.find(),
                error: 'No file uploaded'
            });
        }
        const filename = req.file.filename;
        const image = new Image({
            filename: filename,
            review: '',
        });
        await image.save();
        res.render('index', {
            image: `/images/${filename}`,
            review: '',
            images: await Image.find(),
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            image: null,
            review: null,
            images: await Image.find(),
            error: 'Error uploading image'
        });
    }
};

const downloadImage = async (req, res) => {
    try {
        const file = path.join(__dirname, '../public/images', req.params.filename);
        res.download(file);
    } catch (err) {
        console.error(err);
        res.render('index', {
            image: null,
            review: null,
            images: await Image.find(),
            error: 'Error downloading image'
        });
    }
};

const reviewImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const review = req.body.review ? req.body.review.trim() : '';
        if (!review) {
            throw new Error('Review cannot be empty');
        }
        const image = await Image.findOneAndUpdate(
            { filename: filename },
            { review: review },
            { new: true }
        );
        if (!image) {
            throw new Error('Image not found');
        }
        res.render('index', {
            image: `/images/${filename}`,
            review: review,
            images: await Image.find(),
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            image: null,
            review: null,
            images: await Image.find(),
            error: err.message || 'Error saving review'
        });
    }
};

const getIndex = async (req, res) => {
    try {
        const images = await Image.find();
        res.render('index', {
            images: images,
            image: null,
            review: null,
            error: null,
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            images: [],
            image: null,
            review: null,
            error: 'Error fetching images'
        });
    }
};

module.exports = {
    uploadImage,
    downloadImage,
    reviewImage,
    getIndex
};