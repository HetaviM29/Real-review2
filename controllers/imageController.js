const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const imageService = require('../services/imageService');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
});

const renderIndex = async (res, overrides = {}) => {
    const s3Images = await imageService.getAllS3Images();
    const allReviews = await imageService.getAllReviews();
    const reviewMap = {};
    allReviews.forEach(r => { reviewMap[r.filename] = r.reviews; });

    const imageDTOs = s3Images.map(filename => ({
        filename,
        url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`,
        reviews: reviewMap[filename] || [],
    }));

    res.render('index', {
        images: imageDTOs,
        image: null,
        review: null,
        error: null,
        ...overrides,
    });
};

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        res.redirect('/');
    } catch (error) {
        console.error('Upload Image Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const reviewImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const review = req.body.review?.trim();

        if (!review) {
            return res.status(400).json({ error: 'Review cannot be empty' });
        }

        const updated = await imageService.addReview(filename, review);
        if (!updated) {
            return res.status(404).json({ error: 'Image not found' });
        }

        res.redirect('/');
    } catch (error) {
        console.error('Review Image Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const downloadImage = async (req, res) => {
    try {
        const filePath = getImageFilePath(req.params.filename);
        res.download(filePath, (err) => {
            if (err) {
                console.error('Download Image Error:', err);
                res.status(500).json({ error: 'Error downloading image' });
            }
        });
    } catch (error) {
        console.error('Download Image Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getIndex = async (req, res) => {
    try {
        await renderIndex(res);
    } catch (error) {
        console.error('Get Index Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const serveImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: filename,
        });
        const s3Response = await s3.send(command);

        res.setHeader('Content-Type', s3Response.ContentType || 'image/jpeg');
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Serve Image Error:', error);
        res.status(404).send('Image not found');
    }
};

module.exports = {
    uploadImage,
    reviewImage,
    downloadImage,
    getIndex,
    serveImage,
};
