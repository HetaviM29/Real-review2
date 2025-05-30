const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const imageService = require('../services/imageService');
const { toImageDTO } = require('../dtos/imageDTO');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const renderIndex = async (res, overrides = {}) => {
    const images = await imageService.getAllImages();
    const imageDTOs = images.map(toImageDTO);

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
        const savedImage = await imageService.saveImage(req.file);
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
        const image = await imageService.getImageByFilename(filename);
        if (!image) return res.status(404).send('Image not found');

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: image.filename,
        });
        const s3Response = await s3.send(command);

        res.setHeader('Content-Type', s3Response.ContentType || 'image/jpeg');
        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Serve Image Error:', error);
        res.status(500).send('Error serving image');
    }
};

module.exports = {
    uploadImage,
    reviewImage,
    downloadImage,
    getIndex,
    serveImage,
};
