const express = require('express')
const bodyParser = require("body-parser")
require('dotenv').config()
const app = express();
require('./models/index')

const PORT = process.env.PORT || 1234
const router = require("./routers/index")
app.use(bodyParser.json({limit:"50mb"}))
app.use(bodyParser.urlencoded({limit:"50mb",extended:true}))
app.use(express.json({limit:"50mb"}))
app.use("/", router);
app.listen(PORT,(()=> console.log( "server is connected on "+PORT)))