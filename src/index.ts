if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
import express, { Request, Response }from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import request from 'request'

import cron from 'node-cron';
import { Expo } from "expo-server-sdk";
import {upload} from './util'
const expo = new Expo();

import seedUser from '../schema/seed';

//import Schema from '../schema/schema';

import Middleware from '../middleware/Middleware';
import UserController from './controllers/UserController'

//database 
 mongoose.connect(
    `mongodb+srv://mustymustafa:${process.env.DB_PASSWORD}@cluster0.qx3pi.mongodb.net/myuom?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true},
).then(() =>   console.log('database connected.....'))
.catch((error) => console.log(error.toString()));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




//routes
app.post('/api/v1/signup', Middleware.SignupMiddleware, UserController.signup);



//seedUser();

//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running on ....." + port)
});
