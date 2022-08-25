const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose')
const passport = require('passport')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')
const PORT = process.env.PORT || 3000
const config = require('./config/key')

mongoose.connect(config.mongoURL)
    .then(() => console.log('DB is started'))
    .catch(error => console.log(error))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/analytics',analyticsRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/position',positionRoutes)



app.listen(3000, () => console.log(`Start on ${PORT} port`));