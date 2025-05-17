const express = require('express');
const multer = require('multer');
const path = require('path');
const imageController = require('../controllers/imageController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.get('/', imageController.getIndex);
router.post('/images', upload.single('image'), imageController.uploadImage);
router.get('/download/:filename', imageController.downloadImage);
router.post('/review/:filename', imageController.reviewImage);

module.exports = router;