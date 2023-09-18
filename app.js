const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routers/mainRouters');
const app = express();
const port = 8000;

require('dotenv').config();

mongoose.connect(process.env.DB_KEY)
    .then(() =>{
        console.log('connected successfully')
    }).catch ((e) => {
    console.log('error while connecting', e)
})


app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(port);