const path = require('path');
const dotenv = require('dotenv');
const flash = require("connect-flash")
const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express');
dotenv.config({ path: './config.env' });
const morgan = require('morgan');

const userRouter = require('./routes/userRoutes');
const adminRouter= require("./routes/adminRoutes")
const viewRouter = require('./routes/viewRoutes');
const questionRouter = require('./routes/questionRoutes');

const app = express();

app.use(cookieParser())
app.use(session({
	secret:'happy dog',
	saveUninitialized: true,
	resave: true
}));
app.use(flash());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', viewRouter);
app.use('/user', userRouter);
app.use("/admin", adminRouter)
app.use('/question', questionRouter);

module.exports = app;
