const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const port = 3000;


app.listen(port , ()=>{
    console.log(`Server is running on port ${port}`);
})



