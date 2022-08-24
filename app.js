const express = require('express');
const app = express();
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')

const PORT = process.env.PORT || 3000


app.use('/api/auth', authRoutes)
app.use('/api/analytics',analyticsRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/position',positionRoutes)



app.listen(3000, () => console.log(`Start on ${PORT} port`));