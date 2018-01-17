import mongoose from 'mongoose';
import { Router } from 'express';
import Account from '../model/account';
import bodyParser from 'body-parser';
import passport from 'passport';
import config from '../config';

import {generateAccessToken, respond, authenticate} from '../middleware/authMiddleware';

export default({app, db}) => {
  let api = Router();

  // '/v1/account'
  api.get('/', (req, res) => {
    res.status(200).send({ user: req.user });
  });

  // '/v1/account/register'
  api.post('/register', (req, res) => {
    Account.register(new Account({ username: req.body.email}), req.body.password, function(err, accout) {
      if (err) {
        return res.status(500).send('An error occurred: ' + err);
      }

      passport.authenticate(
        'local', {
          session: false
        })(req, res, () => {
          res.status(200).send('Successfully created new account');
        });
    });
  });

  // '/v1/account/login'
  api.post('/login', passport.authenticate(
    'local', {
      session: false,
      scope: []
    }), generateAccessToken, respond);

  // 'v1/account/logout'
  api.get('/logout', authenticate, (req, res) => {
     res.logout();
     res.status(200).send('Successfully logged out');
  });

  // '/v1/account/ping'
  api.get('/me', authenticate, (req, res) => {
    res.status(200).json(req.user);
  });

  // '/v1/account/ping'
  api.get('/ping', (req, res) => {
    res.status(200).send("pong!");
  });

  return api;
}
