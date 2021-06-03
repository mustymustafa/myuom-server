"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//import Validator from './validator/Validator';
class MiddleWare {
    static SignupMiddleware(req, res, next) {
        let { email, password, fullname, cpassword } = req.body;
        email = email.trim();
        password = password.trim();
        fullname = fullname.trim();
        let errors = [];
        if (!email) {
            errors = [...errors, {
                    email: 'You have not entered an email'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (cpassword !== password) {
            errors = [...errors, {
                    cpassword: 'Passwords do not match'
                }];
        }
        if (!((/^[a-zA-Z .'-]+\s[a-zA-Z .'-]+$/.test(fullname.trim())))) {
            errors = [
                ...errors, {
                    errorMessage: 'Please enter your first and last name',
                }
            ];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static signinMiddleware(req, res, next) {
        let { email, password, } = req.body;
        email = email.trim();
        password = password.trim();
        let errors = [];
        if (!email) {
            errors = [...errors, {
                    email: 'You have not entered an email'
                }];
        }
        if (password.trim().length < 6) {
            errors = [...errors, {
                    password: 'Password is too short'
                }];
        }
        if (errors.length) {
            return res.status(400).send({
                errors
            });
        }
        next();
    }
    static authorization(req, res, next) {
        const token = req.headers['x-access-token'];
        if (token && process.env.SECRET) {
            jsonwebtoken_1.default.verify(token, process.env.SECRET, (err, decoded) => {
                if (err) {
                    res.status(403).send({
                        message: 'Expired session. Please login'
                    });
                }
                else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
        else {
            res.status(403).send({
                message: 'Expired session. Please login'
            });
        }
    }
}
exports.default = MiddleWare;
