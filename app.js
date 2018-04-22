//bring in express to start the serve
const express = require('express');
const app = express();
const port = 3001;
app.listen(port, () => {
  console.log('server started on port' + port);
});

//other
const path = require('path');
const bodyParser = require('body-parser');
const cookParser = require('cookie-parser');

//routes
const routes = require('./routes/index');

//session for user access
var session = require('express-session');
app.use(session({
  secret: process.env.SECRET || "jhbdsjbcfvba", //go back to encrypt the secret
  resave: false,
  saveUninitialized: true
}));

//log errors
let logger = require('morgan');

//environment variable object
var dotenv = require('dotenv');
dotenv.config();

// set view engine -> "views" folder is checked by default
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

////// middleware
//note: no view engine just html so avoid using res.render on server
// -> we are using app.use(express.static(path.join(__dirname, 'public'))); to render just html
//note bodyParser must be defined before the routes in order to use req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', routes);
app.use(express.static(path.join(__dirname, './public')));




//error handling
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
