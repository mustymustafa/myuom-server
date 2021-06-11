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
import {upload, uploadFile} from './util'
const expo = new Expo();

import seedUser from './schema/seed';

//import Schema from '../schema/schema';

import Middleware from './middleware/Middleware'
import UserController from './controllers/UserController'
import ForumController from './controllers/ForumController'

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

//image upload route
app.post('/api/v1/image', upload.single('image'), UserController.uploadimage);
//set images
app.post('/api/v1/setid', UserController.setId);
app.post('/api/v1/updateid', UserController.updateId);


//file upload route
app.post('/api/v1/file', uploadFile.single('file'), ForumController.uploadfile);


//forum
//post a question
app.post('/api/v1/post', ForumController.makePost);
app.post('/api/v1/posts', ForumController.getPosts);
app.post('/api/v1/:uid/posts', ForumController.getMyPosts);
app.get('/api/v1/post/:pid', ForumController.getPost);
app.post('/api/v1/comment', ForumController.addComment);
app.get('/api/v1/comments/:pid', ForumController.getComments);
app.post('/api/v1/:cid/like', ForumController.likeComment);
app.post('/api/v1/:cid/dislike', ForumController.dlikeComment);
app.post('/api/v1/:pid/deletepost', ForumController.deletePost);
app.post('/api/v1/:cid/deletecomment', ForumController.deleteComment);








//seedUser();

//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running on ....." + port)
});
