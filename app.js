const express = require('express')
const app = express()
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')
const https = require('https')
const dotenv = require('dotenv')
app.use(express.static(__dirname));
app.use(express.json());
dotenv.config()
app.use(bodyParser.urlencoded({extended:true}))
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flag: 'a' })
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view','login',"login.html"));
})
app.use(express.static(path.join(__dirname,'view')));


sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log('running 3000')
  })
  .catch((err) => {
    console.log(err)
  })