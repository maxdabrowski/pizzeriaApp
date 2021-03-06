var createError = require('http-errors');
var cookieSession = require('cookie-session'); 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var cors = require('cors');

mongoose.connect(config.db, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection erroe:'));

var mainRouter = require('./routes/main');
var staffRouter = require('./routes/staff');
var kitchenRouter = require('./routes/kitchen');
var managerRouter = require('./routes/manager');
var apiRouter = require('./routes/api');

var app = express();

// ustawienia silnika 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name:'session',
  keys: config.keySession,
  maxAge: config.maxAgeSession,
}))

app.use(function(req,res,next){
  res.locals.path = req.path;
  
  next();
})

// ustawieni ścieżek
app.use('/', mainRouter);
app.use('/staff', staffRouter);
app.use('/kitchen', kitchenRouter);
app.use('/manager', managerRouter);
app.use('/manager/menu_manage', managerRouter);
app.use('/API', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// obsługa błędu
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
