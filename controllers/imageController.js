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
    res.status(501).send('Download not implemented');
};

const reviewImage = async (req, res) => {
    res.status(501).send('Review not implemented');
};

module.exports = {
    getIndex,
    uploadImage,
    downloadImage,
    reviewImage,
};
