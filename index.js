require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/dbConn');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookierParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 4150;

// Connect to MongoDB
connectDB();

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookierParser());

app.use('/',express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/root'));
app.use('/register',require('./routes/register'));
app.use('/user', require('./routes/user'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/products',require('./routes/products'));

app.use(verifyJWT)
app.use('/create-payment-intent', require('./routes/payment'));
app.use('/cart',require('./routes/cart'));
app.use('/orders',require('./routes/orders'));
app.use('/wishlist',require('./routes/wishlist'));

app.all('*', (req,res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')){
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler);
mongoose.connection.once('open', () => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
