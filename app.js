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
const sequelize = require('./util/database')
const User = require('./models/users')
const Expense = require('./models/expense')


const userRoutes = require('./routes/users')
const expenseRoutes = require('./routes/expense')

//middlewares
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
app.use(compression())

//routes
app.use('/user', userRoutes)
app.use('/expense', expenseRoutes)





const Downloadurl = require('./models/downloadurls');
User.hasMany(Expense)
Expense.belongsTo(User)



User.hasMany(Downloadurl,{
  foreignKey:'userId'
});
Downloadurl.belongsTo(User,
  {
  foreignKey:'userId'
  }
);


sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log('running 3000')
  })
  .catch((err) => {
    console.log(err)
  })