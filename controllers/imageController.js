const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const imageService = require('../services/imageService');
const s3 = new S3Client({ region: process.env.AWS_REGION });

const renderIndex = async (res, overrides = {}) => {
    const s3Images = await imageService.getAllS3Images();
    const allReviews = await imageService.getAllReviews();
    const reviewMap = {};
    allReviews.forEach(r => {
        if (!reviewMap[r.filename]) reviewMap[r.filename] = [];
        reviewMap[r.filename].push({ reviewer: r.reviewer, review: r.review, timestamp: r.timestamp });
    });

    const reviewFilenames = [...new Set(allReviews.map(r => r.filename))];
    const deletedImages = reviewFilenames.filter(filename => !s3Images.includes(filename));
    
    const imageDTOs = await Promise.all(s3Images.map(async (filename) => {
        const command = new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: filename });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        const meta = await imageService.getImageMetadata(filename);
        return {
            filename,
            url: signedUrl,
            imageName: meta?.imageName || filename,
            uploadedBy: meta?.uploadedBy || 'Unknown',
            location: meta?.location || 'Unknown',
            uploadDate: meta?.uploadDate,
            reviews: reviewMap[filename] || []
        };
    }));

    res.render('index', {
        images: imageDTOs,
        image: null,
        review: null,
        error: overrides.error || null,
        deletedImages: deletedImages.length > 0 ? deletedImages : null // Pass to view
    });
};

const getIndex = async (req, res) => {
    await renderIndex(res);
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) throw new Error('No file uploaded');
        await imageService.addImageMetadata({
            filename: req.file.key,
            imageName: req.body.imageName,
            uploadedBy: req.body.uploadedBy,
            location: req.body.location,
            uploadDate:new Date().toISOString() 
        });
        await renderIndex(res);
    } catch (error) {
        await renderIndex(res, { error: 'Failed to upload image' });
    }
};

const reviewImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const review = req.body.review;
        const reviewer = req.body.reviewer || 'Anonymous';
        if (!review || review.trim() === '') throw new Error('Review cannot be empty');
        await imageService.addReview(filename, review.trim(), reviewer);
        await renderIndex(res);
    } catch (error) {
        await renderIndex(res, { error: 'Failed to add review' });
    }
};

const downloadImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: filename,
        });
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1 minute expiry
        res.redirect(signedUrl);
    } catch (error) {
        await renderIndex(res, { error: 'Failed to generate download link' });
    }
};

module.exports = {
    getIndex,
    uploadImage,
    reviewImage,
    downloadImage,
};
