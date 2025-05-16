const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const port = 3000;

const Image = require('./models/imagemodel');
mongoose.connect('mongodb://localhost:27017/imageupload',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log('Error connecting to MongoDB:', err);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let reviews = {};

const storage = multer.diskStorage({
    destination: './public/images/',
    filename: function(req, file , cb){
        cb(null , Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage: storage});

app.set('view engine' , 'ejs');
app.use(express.static('public'));




//post for upload
app.post('/images' , upload.single('image'),async(req,res)=>{
    const filename = req.file.filename;

    const image = new Image({
        filename: filename,
        review: ' ',
    });

    await image.save();

    res.render('index',{
        image: `/images/${filename}`,
        review: ' ',
        images: await Image.find(),
        error: null,
    })

    
});


//download route
app.get('/download/:filename' , (req,res)=>{
    const file = path.join(__dirname, 'public/images' , req.params.filename);
    res.download(file); 
})

app.post('/review/:filename' , async(req,res)=>{
    try{
    const filename = req.params.filename;
    const review = req.body.review;  
    
    const image = await Image.findOneAndUpdate(
        {filename: filename},
        {review: review},
        {new: true}
    );

    if (!image){
        throw new Error('Image not found');
    }

    res.render('index',{
        image:  `/images/${filename}`,
        review: review,
        images: await Image.find(),
        error: null,
    })
    }catch(err){
        console.error(err);
        res.render('index' , {image: null , review: null , images:[] , error: 'Error saving review'});
    }
});

app.get('/' , async(req , res)=> {
    const images = await Image.find();
    res.render('index' , {
        images: images,
        image: null,
        review: null,
        error: null,
    });
})
app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})