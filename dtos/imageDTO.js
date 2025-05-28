const toImageDTO = (imageDoc) => {
    return {
        filename: imageDoc.filename,
        reviews: imageDoc.reviews,
        imageUrl: `/images/${imageDoc.filename}`,
    };
};

module.exports = { toImageDTO };
