const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const port = 3000;
require('dotenv').config();
const app = express();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static('./public'));

const imageRouter = require('./routes/imageRoute');
app.use('/', imageRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('index', {
        images: [],
        image: null,
        review: null,
        error: 'Something went wrong!'
    });
});

app.listen(port, '0.0.0.0' ,  () => {
    console.log(`Server is running on port ${port}`);
});