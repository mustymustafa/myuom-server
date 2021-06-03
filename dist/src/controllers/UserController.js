"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = __importDefault(require("../../schema/schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
//date initialization
const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + '/' + day + '/' + year;
var transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'musty.mohammed1998@gmail.com',
        pass: process.env.PASS
    }
});
class UserController {
    //signup function
    static signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullname, email, password, cpassword } = request.body;
            console.log(request.body);
            try {
                const foundEmail = yield schema_1.default.User().find({ email: email.trim() });
                if (foundEmail && foundEmail.length > 0) {
                    console.log(foundEmail[0]);
                    return response.status(409).send({
                        message: 'This email already exists',
                        isConfirmed: foundEmail[0].isConfirmed
                    });
                }
                if (cpassword.trim() !== password.trim()) {
                    return response.status(409).send({
                        message: 'The Password do not match'
                    });
                }
                const confirmationCode = String(Date.now()).slice(9, 13);
                const message = `Verification code: ${confirmationCode}`;
                UserController.sendMail(email.trim(), message, 'User Verification code');
                yield schema_1.default.User().create({
                    name: fullname.trim(),
                    email: email.trim(),
                    password: bcrypt_1.default.hashSync(password.trim(), UserController.generateSalt()),
                    confirmationCode,
                    isConfirmed: false
                });
                response.status(201).send({
                    message: 'User created successfully',
                    status: 201
                });
            }
            catch (error) {
                console.log(error.toString());
                response.status(500).send({
                    message: "Somenthing went wrong"
                });
            }
        });
    }
    // continue signup
    static setProfile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pic, level, department, email } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.User().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    yield schema_1.default.User().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            pic: pic,
                            level: level,
                            department: department
                        }
                    });
                    return response.status(200).send({
                        message: 'User updated successfully',
                        status: 201
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: 'something went wrong'
                    });
                }
            }
        });
    }
    //upload images
    static uploadimage(req, res) {
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
    static setId(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const email = request.body.email;
                const image = request.body.image;
                console.log(email);
                console.log(image);
                const foundUser = yield schema_1.default.User().findOne({ email });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.User().updateOne({
                        _id: foundUser._id
                    }, {
                        $set: {
                            pic: image
                        }
                    });
                    return res.status(200).send("image set");
                }
            }
            catch (error) {
                console.log(error.toString());
                res.status(500).send({
                    message: 'something went wrong'
                });
            }
        });
    }
    static generateSalt() {
        return bcrypt_1.default.genSaltSync(10);
    }
    //generate token
    static generateToken(user) {
        return process.env.SECRET && jsonwebtoken_1.default.sign({
            _id: user._id,
            name: user.name,
            email: user.email,
            isConfirmed: user.isConfirmed
        }, process.env.SECRET, { expiresIn: 100 * 60 * 60 });
    }
    //send email function
    static sendMail(email, message, subject) {
        try {
            const msg = {
                to: email,
                from: 'My UOM App',
                subject,
                html: `<p> ${message}</p>`
            };
            transporter.sendMail(msg, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log('Email sent: ' + info);
                }
            });
        }
        catch (error) {
            console.log(error.toString());
        }
    }
}
exports.default = UserController;
