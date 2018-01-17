import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import passport from 'passport';
const LocalStrategy = require('passport-local').Strategy;

import config from "./config";
import routes from "./routes";

let app = express();
app.server = http.createServer(app);

// middelware
// parse application/json
app.use(bodyParser.json({
  limit: config.bodyLimit
}));

// passport config
app.use(passport.initialize());
let account = require('./model/account');
passport.use( new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  account.authenticate()
));
passport.serializeUser(account.serializeUser());
passport.deserializeUser(account.deserializeUser());


// api routes v1
app.use('/v1', routes);

app.server.listen(config.port);
console.log(`Started on port ${app.server.address().port}`);

export default app;
