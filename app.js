require('dotenv').config();
const express = require('express'), 
      app     = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      expressLayout = require('express-ejs-layouts'),
      flash  = require('connect-flash'),
      session = require('express-session'),
      passport = require('passport'),
      port    = process.env.PORT;


// Passport Configuration
require('./config/passport')(passport);
// Database Connection
mongoose.connect(process.env.DB_URI , {useNewUrlParser : true , 
    useUnifiedTopology : true , useCreateIndex : true})
    .then(()=>console.log("Connection Success"))
    .catch((err)=>console.log(err));
// Setting Our Views
app.set('view engine' , 'ejs');
app.use(expressLayout);
// BodyParser Middleware
app.use(express.urlencoded({extended : true}));
// Express Session
app.use(session({
    secret : 'keyboard cat' ,
    resave : false , 
    saveUninitialized : false ,
    cookie : {secure : true , maxAge : 6000}
}));
// Passport Middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Routes 
app.use('/' , require('./routes/main'));
app.use('/users' , require('./routes/users'));

// Server Running 
app.listen(port , ()=>{
    console.log(`Server Running at localhost : ${port}`);
});


