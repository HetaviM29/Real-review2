const Review = require('../models/imagemodel');
const { ListObjectsV2Command, S3Client } = require('@aws-sdk/client-s3');
const s3 = new S3Client({ region: process.env.AWS_REGION });

const addReview = async (filename, review) => {
    return await Review.findOneAndUpdate(
        { filename },
        { $push: { reviews: review } },
        { new: true, upsert: true }
    );
};

const getAllReviews = async () => {
    // Returns { filename, reviews } for all reviewed images
    return await Review.find({}, { filename: 1, reviews: 1, _id: 0 });
};

const getReviewsByFilename = async (filename) => {
    const doc = await Review.findOne({ filename });
    return doc ? doc.reviews : [];
};

const getAllS3Images = async () => {
    const command = new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET,
    });
    const data = await s3.send(command);
    return (data.Contents || []).map(obj => obj.Key);
};

module.exports = {
    addReview,
    getAllReviews,
    getReviewsByFilename,
    getAllS3Images,
};
