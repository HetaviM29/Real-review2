const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const imageService = require('../services/imageService');

const s3 = new S3Client({ region: process.env.AWS_REGION });

const renderIndex = async (res, overrides = {}) => {
    const s3Images = await imageService.getAllS3Images();
    const allReviews = await imageService.getAllReviews();
    const reviewMap = {};
    allReviews.forEach(r => { reviewMap[r.filename] = r.reviews; });

    const imageDTOs = await Promise.all(s3Images.map(async (filename) => {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: filename,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 }); // 1 hour
        return {
            filename,
            url: signedUrl,
            reviews: reviewMap[filename] || [],
        };
    }));
    
    res.render('index', {
        images: imageDTOs,
        image: null,
        review: null,
        error: null,
        ...overrides,
    });
};


const getIndex = async (req, res) => {
    await renderIndex(res);
};

const uploadImage = async (req, res) => {
    await renderIndex(res);
};

const downloadImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: filename,
        });

        // Generate a signed URL that expires in 5 minutes
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
        
        // Redirect to the signed URL for download
        res.redirect(signedUrl);
    } catch (error) {
        console.error('Download error:', error);
        await renderIndex(res, { error: 'Failed to download image' });
    }
};

const reviewImage = async (req, res) => {
    try {
        const filename = req.params.filename;
        const review = req.body.review;

        if (!review || review.trim() === '') {
            throw new Error('Review cannot be empty');
        }

        // Add the review
        await imageService.addReview(filename, review.trim());
        
        // Refresh the page
        await renderIndex(res);
    } catch (error) {
        console.error('Review error:', error);
        await renderIndex(res, { error: 'Failed to add review' });
    }
};

module.exports = {
    getIndex,
    uploadImage,
    downloadImage,
    reviewImage,
};
