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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
const Middleware_1 = __importDefault(require("../middleware/Middleware"));
const UserController_1 = __importDefault(require("./controllers/UserController"));
//database 
mongoose_1.default.connect(`mongodb+srv://mustymustafa:${process.env.DB_PASSWORD}@cluster0.qx3pi.mongodb.net/myuom?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log('database connected.....'))
    .catch((error) => console.log(error.toString()));
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
//routes
app.post('/api/v1/signup', Middleware_1.default.SignupMiddleware, UserController_1.default.signup);
//seedUser();
//server
const port = process.env.PORT && parseInt(process.env.PORT, 10) || 8080;
app.set('port', port);
const server = http_1.default.createServer(app);
server.listen(port, () => {
    console.log("server running on ....." + port);
});
