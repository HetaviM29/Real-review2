const { docClient } = require('../config/dynamodb');
const { ListObjectsV2Command, S3Client } = require('@aws-sdk/client-s3');
const { PutCommand, QueryCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const s3 = new S3Client({ region: process.env.AWS_REGION });

const addImageMetadata = async (meta) => {
    await docClient.send(new PutCommand({
        TableName: "Meta_data",
        Item: meta
    }));
};

const addReview = async (filename, review, reviewer) => {
    await docClient.send(new PutCommand({
        TableName: "Reviews",
        Item: {
            filename,
            timestamp: Date.now(),
            review,
            reviewer
        }
    }));
};

const getAllReviews = async () => {
    const data = await docClient.send(new ScanCommand({ TableName: "Reviews" }));
    return data.Items || [];
};

const getReviewsByFilename = async (filename) => {
    const data = await docClient.send(new QueryCommand({
        TableName: "Reviews",
        KeyConditionExpression: "filename = :filename",
        ExpressionAttributeValues: { ":filename": filename }
    }));
    return data.Items || [];
};

const getAllS3Images = async () => {
    const command = new ListObjectsV2Command({ Bucket: process.env.AWS_S3_BUCKET });
    const data = await s3.send(command);
    return (data.Contents || []).map(obj => obj.Key);
};

const getImageMetadata = async (filename) => {
    const data = await docClient.send(new QueryCommand({
        TableName: "Meta_data",
        KeyConditionExpression: "filename = :filename",
        ExpressionAttributeValues: { ":filename": filename }
    }));
    return data.Items?.[0];
};

module.exports = {
    addImageMetadata,
    addReview,
    getAllReviews,
    getReviewsByFilename,
    getAllS3Images,
    getImageMetadata
};
