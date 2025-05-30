const toImageDTO = (imageDoc) => {
    return {
        filename: imageDoc.filename,
        reviews: imageDoc.reviews,
    };
};

module.exports = { toImageDTO };
