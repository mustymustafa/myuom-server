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


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());










//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, ()=> {
    console.log("server running on ....." + port)
});
