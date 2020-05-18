const express = require('express');

const ApiRouter = require('./data/apiRouter.js');

const server = express();

server.use(express.json());



server.use('/api', ApiRouter);


module.exports = server;