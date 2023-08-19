//const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';

import userRouter from './routes/user.routes.js';

const app = express();
const port = 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Pozdrav svima v31!');
});

app.get('/health', (req,res) => {
    res.send('Working...');
});

app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});