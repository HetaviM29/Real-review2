const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Configure S3 client
const s3 = new S3Client({
    region: process.env.AWS_REGION,
});

console.log('Uploading to bucket:', process.env.AWS_S3_BUCKET);
// Multer S3 storage
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET,
        key: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname);
        }
    })
});

router.get('/', imageController.getIndex);
router.post('/images', upload.single('image'), imageController.uploadImage);
router.get('/download/:filename', imageController.downloadImage);
router.post('/review/:filename', imageController.reviewImage);
router.get('/image/:filename', imageController.serveImage);

module.exports = router;