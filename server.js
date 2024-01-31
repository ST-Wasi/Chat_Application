const express = require('express');
const app = express();
const {connectDb} = require('./Connectivity/db')
const startSocket = require('./ws')
const session = require('express-session')
const User = require('./models/User')
const passport = require('passport')
const authRouter = require('./Routes/auth')
const searchRoutes = require('./Routes/search')
const LocalStrategy = require('passport-local')

let configSession = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
      httpOnly: true,
      expires: Date.now()+ 7*24*60*60*1000,
      maxAge: 7*24*60*60*1000
    }
  };

  app.use(express.urlencoded({extended: true}))
  app.use(express.json());
  app.use(session(configSession))

  app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.get('/',(req,res)=>{
    res.send({msg: "server is coonnected"})
})

app.use(authRouter);
app.use(searchRoutes);



let PORT  = 8080
app.listen(PORT,()=>{
    connectDb()
    startSocket(this);
    console.log(`server started lisrening at: http://localhost:${PORT}`)
})