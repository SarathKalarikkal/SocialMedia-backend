const express = require('express')
const connectDB = require('./mongooseConnect')
const app = express()
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());
connectDB()

require("./models/user")
require("./models/post")
require("./models/follow")
require("./models/likes")

app.use(bodyParser.json())


app.get('/', function (req, res) {
  res.send('Hello World')
})

app.use('/', require('./routers'))

app.use('/public', express.static('public'))

app.listen(process.env.PORT, ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
