if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
import express, { Request, Response } from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';


import cron from 'node-cron';
import { Expo } from "expo-server-sdk";
import {upload, uploadFile} from './util'
const expo = new Expo();

import seedUser from './schema/seed';

//import Schema from '../schema/schema';

import Middleware from './middleware/Middleware'
import UserController from './controllers/UserController'
import ForumController from './controllers/ForumController'

import CampusController from './controllers/CampusController';
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
app.use(cors());




//routes


app.post('/api/v1/set-profile', UserController.setProfile);
app.post('/api/v1/update-profile', UserController.updateUser);
app.post('/api/v1/signin', Middleware.signinMiddleware, UserController.signin);
//get user details
app.get('/api/v1/user/:uid', UserController.userDetails);
//push notification
app.post('/api/v1/token/:uid', UserController.savePushToken);

app.post('/api/v1/confirmation', UserController.confirm);
app.post('/api/v1/resend-otp', UserController.resendOtp);
app.post('/api/v1/forgot-password', UserController.forgotPassword);
app.post('/api/v1/change-password', UserController.changePassword);




//forum
//post a question
app.post('/api/v1/post', ForumController.makePost);
app.post('/api/v1/posts', ForumController.getPosts);
app.get('/api/v1/post/:pid', ForumController.getPost);
app.post('/api/v1/comment', ForumController.addComment);
app.get('/api/v1/comments/:pid', ForumController.getComments);
app.post('/api/v1/:cid/like', ForumController.likeComment);
app.post('/api/v1/:cid/dislike', ForumController.dlikeComment);
app.post('/api/v1/:pid/deletepost', ForumController.deletePost);
app.post('/api/v1/:cid/deletecomment', ForumController.deleteComment);
app.get('/api/v1/activity/:uid', ForumController.getMyPosts);


//campus guide
app.post('/api/v1/location', CampusController.addLocation);
app.get('/api/v1/locations', CampusController.getLocations);
app.post('/api/v1/getlocation', CampusController.getLocation);

app.post('/api/v1/location/update', CampusController.updateLocation);




//seedUser();

//server



module.exports = app;
