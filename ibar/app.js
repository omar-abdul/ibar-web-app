var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var helmet = require('helmet')
var config = require('./config/database');
var pg = require('pg');
var passport = require('passport');


var index = require('./routes/index');

var app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// var pool = new pg.Pool(config);


var server=app.listen(process.env.PORT||4000, function(){
	console.log("Server started at" +process.env.PORT)

});

var graceFullShutdown = function(){
	console.log("Signal recieved")
	server.close(function(){
		console.log("closed out all connections")
		process.exit();
	});

	setTimeout(function(){
		console.error("could not close connections in time")
		process.exit();
	},10*1000)
	
}

process.on('SIGTERM',graceFullShutdown);

process.on('SIGINT',graceFullShutdown)


app.use('/api',index);

app.get('/', (req, res)=> {
  res.send("Invalid end Point");
});



app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})



// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   // res.render('error');
// });



module.exports = app;
