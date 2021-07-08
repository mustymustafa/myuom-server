"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
//import Schema from '../schema/schema';
const Middleware_1 = __importDefault(require("./middleware/Middleware"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
const ForumController_1 = __importDefault(require("./controllers/ForumController"));
const CampusController_1 = __importDefault(require("./controllers/CampusController"));
//database 
mongoose_1.default.connect(`mongodb+srv://mustymustafa:${process.env.DB_PASSWORD}@cluster0.qx3pi.mongodb.net/myuom?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('database connected.....'))
    .catch((error) => console.log(error.toString()));
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
app.use(cors_1.default());
//routes
app.post('/api/v1/set-profile', UserController_1.default.setProfile);
app.post('/api/v1/update-profile', UserController_1.default.updateUser);
app.post('/api/v1/signin', Middleware_1.default.signinMiddleware, UserController_1.default.signin);
//get user details
app.get('/api/v1/user/:uid', UserController_1.default.userDetails);
//push notification
app.post('/api/v1/token/:uid', UserController_1.default.savePushToken);
app.post('/api/v1/confirmation', UserController_1.default.confirm);
app.post('/api/v1/resend-otp', UserController_1.default.resendOtp);
app.post('/api/v1/forgot-password', UserController_1.default.forgotPassword);
app.post('/api/v1/change-password', UserController_1.default.changePassword);
//forum
//post a question
app.post('/api/v1/post', ForumController_1.default.makePost);
app.post('/api/v1/posts', ForumController_1.default.getPosts);
app.get('/api/v1/post/:pid', ForumController_1.default.getPost);
app.post('/api/v1/comment', ForumController_1.default.addComment);
app.get('/api/v1/comments/:pid', ForumController_1.default.getComments);
app.post('/api/v1/:cid/like', ForumController_1.default.likeComment);
app.post('/api/v1/:cid/dislike', ForumController_1.default.dlikeComment);
app.post('/api/v1/:pid/deletepost', ForumController_1.default.deletePost);
app.post('/api/v1/:cid/deletecomment', ForumController_1.default.deleteComment);
app.get('/api/v1/activity/:uid', ForumController_1.default.getMyPosts);
//campus guide
app.post('/api/v1/location', CampusController_1.default.addLocation);
app.get('/api/v1/locations', CampusController_1.default.getLocations);
app.post('/api/v1/getlocation', CampusController_1.default.getLocation);
app.post('/api/v1/location/update', CampusController_1.default.updateLocation);
//seedUser();
//server
module.exports = app;
