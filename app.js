const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const express = require('express');


const app = express();
dotenv.config();
const server = http.createServer(app); 
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api',require('./api/api.router'));

server.listen(port,()=>{
    console.log(`server is running at ${port} port`);
})