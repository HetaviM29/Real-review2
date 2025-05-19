const toImageDTO = (imageDoc) => {
    return {
        filename: imageDoc.filename,
        review: imageDoc.review,
        imageUrl: `/images/${imageDoc.filename}`,
    };
};

module.exports = { toImageDTO };
