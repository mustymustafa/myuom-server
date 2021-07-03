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
const schema_1 = __importDefault(require("../schema/schema"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
//date initialization
const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + "/" + day + "/" + year;
var transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: "musty.mohammed1998@gmail.com",
        pass: process.env.PASS,
    },
});
class UserController {
    //signup function
    /**
    static async signup(request: Request, response: Response) {
      const { fullname, email, password, cpassword } = request.body;
  
      console.log(request.body);
  
      try {
        const foundEmail = await Schema.User().find({ email: email.trim() });
        if (foundEmail && foundEmail.length > 0) {
          console.log(foundEmail[0]);
          return response.status(409).send({
            message: "This email already exists",
            isConfirmed: foundEmail[0].isConfirmed,
          });
        }
  
        if (cpassword.trim() !== password.trim()) {
          return response.status(409).send({
            message: "The Password do not match",
          });
        }
  
        const confirmationCode = String(Date.now()).slice(9, 13);
        const message = `Verification code: ${confirmationCode}`;
        UserController.sendMail(email.trim(), message, "User Verification code");
  
        await Schema.User().create({
          name: fullname.trim(),
          email: email.trim(),
          password: bcrypt.hashSync(
            password.trim(),
            UserController.generateSalt()
          ),
          confirmationCode,
          isConfirmed: false,
        });
  
        response.status(201).send({
          message: "User created successfully",
          status: 201,
        });
      } catch (error) {
        console.log(error.toString());
        response.status(500).send({
          message: "Somenthing went wrong",
        });
      }
    }
  
    */
    //sign in
    static signin(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            console.log(email);
            const foundUser = yield schema_1.default.User().findOne({ email: email.trim() });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (!bcrypt_1.default.compareSync(password, foundUser.password)) {
                    return response.status(403).send({
                        message: "Incorrect Password",
                    });
                }
                return response.status(200).send({
                    token: UserController.generateToken(foundUser),
                });
            }
            else {
                return response.status(401).send({
                    message: "Incorrect Username or Password",
                });
            }
        });
    }
    // continue signup
    static setProfile(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { level, department, email } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.User().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    if (level.length < 1 || department.length < 1) {
                        return response.status(409).send({
                            message: "Level and department are required",
                        });
                    }
                    yield schema_1.default.User().updateOne({
                        _id: foundUser._id,
                    }, {
                        $set: {
                            level: level,
                            department: department,
                        },
                    });
                    return response.status(200).send({
                        message: "User updated successfully",
                        status: 201,
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: "something went wrong",
                    });
                }
            }
        });
    }
    //update profile
    static updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, department, level } = request.body;
            console.log(request.body);
            const foundUser = yield schema_1.default.User().findOne({ _id: uid });
            if (foundUser && Object.keys(foundUser).length > 0) {
                console.log(foundUser);
                try {
                    yield schema_1.default.User().updateOne({
                        _id: uid,
                    }, {
                        $set: {
                            department: department,
                            level: level,
                        },
                    });
                    return response.status(200).send({
                        message: "User updated successfully",
                        status: 201,
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: "something went wrong",
                    });
                }
            }
        });
    }
    //confirmation
    //confrimation code
    static confirm(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, confirmationCode } = request.body;
            const foundUser = yield schema_1.default.User().findOne({ email });
            if (foundUser && Object.keys(foundUser).length > 0) {
                if (foundUser.confirmationCode !== confirmationCode) {
                    return response.status(403).send({
                        message: "Incorrect confirmation code",
                    });
                }
                try {
                    const dt = new Date();
                    const createdAt = dt.toLocaleDateString();
                    console.log(createdAt);
                    yield schema_1.default.User().updateOne({
                        _id: foundUser._id,
                    }, {
                        $set: {
                            isConfirmed: true,
                            createdAt: createdAt,
                        },
                    });
                    foundUser.isConfirmed = true;
                    return response.status(200).send({
                        token: UserController.generateToken(foundUser),
                    });
                }
                catch (error) {
                    console.log(error.toString());
                    response.status(500).send({
                        message: "something went wrong",
                    });
                }
            }
            else {
                return response.status(401).send({
                    message: "Incorrect Username or Password",
                });
            }
        });
    }
    //send otp
    static resendOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            console.log(email);
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.User().updateOne({
                    email,
                }, {
                    $set: {
                        confirmationCode,
                    },
                });
                const message = `Token: ${confirmationCode}`;
                UserController.sendMail(email, message, "Confirmation Code");
                response.status(200).send({
                    message: "Please check your mailbox for token",
                });
                return;
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: "Something went wrong",
                });
            }
        });
    }
    //forgot password
    static forgotPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            const user = yield schema_1.default.User().findOne({ email: email.trim() });
            if (!user) {
                return response.status(404).send({
                    message: "User does not exist",
                });
            }
            const confirmationCode = String(Date.now()).slice(9, 13);
            try {
                yield schema_1.default.User().updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        confirmationCode,
                    },
                });
                const message = `Token: ${confirmationCode}`;
                UserController.sendMail(user.email, message, "Password change");
                return response.status(200).send({
                    message: "Please check your email for token",
                });
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: "Something went wrong",
                });
            }
        });
    }
    //change password
    static changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { confirmationCode, password, email } = request.body;
            if (!confirmationCode || !confirmationCode.trim()) {
                return response.status(400).send({
                    message: "Token is required",
                });
            }
            if (!password || !password.trim()) {
                return response.status(400).send({
                    message: "Password is required",
                });
            }
            const user = yield schema_1.default.User().findOne({ email: email.trim() });
            if (!user) {
                return response.status(404).send({
                    message: "User does not exist",
                });
            }
            if (user.confirmationCode !== confirmationCode) {
                return response.status(403).send({
                    message: "Incorrect token code",
                });
            }
            try {
                yield schema_1.default.User().updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        password: bcrypt_1.default.hashSync(password.trim(), UserController.generateSalt()),
                    },
                });
                return response.status(200).send({
                    token: UserController.generateToken(user),
                });
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: "Something went wrong",
                });
            }
        });
    }
    //upload images
    static uploadimage(req, res) {
        console.log(req.file.originalname.split(" "));
        const parts = req.file.originalname.split(" ");
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
                        _id: foundUser._id,
                    }, {
                        $set: {
                            pic: image,
                        },
                    });
                    return res.status(200).send("image set");
                }
            }
            catch (error) {
                console.log(error.toString());
                res.status(500).send({
                    message: "something went wrong",
                });
            }
        });
    }
    static updateId(request, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(request.body);
            try {
                const uid = request.body.uid;
                const image = request.body.image;
                console.log(image);
                const foundUser = yield schema_1.default.User().findOne({ _id: uid });
                if (foundUser && Object.keys(foundUser).length > 0) {
                    console.log(foundUser);
                    yield schema_1.default.User().updateOne({
                        _id: uid,
                    }, {
                        $set: {
                            pic: image,
                        },
                    });
                    return res.status(200).send("profile picture updated");
                }
            }
            catch (error) {
                console.log(error.toString());
                res.status(500).send({
                    message: "something went wrong",
                });
            }
        });
    }
    static generateSalt() {
        return bcrypt_1.default.genSaltSync(10);
    }
    //generate token
    static generateToken(user) {
        return (process.env.SECRET &&
            jsonwebtoken_1.default.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                isConfirmed: user.isConfirmed,
            }, process.env.SECRET, { expiresIn: 100 * 60 * 60 }));
    }
    static savePushToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            const token = request.body.token;
            console.log("token" + token);
            console.log("uid" + uid);
            //check token
            if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
                console.log("invalid token");
                return response.status(404).send({
                    message: "invalid token",
                });
            }
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                if (!user) {
                    return response.status(404).send({
                        message: "User does not exist",
                    });
                }
                if (user.pushToken === token) {
                    console.log("token exists already");
                    return response.status(404).send({
                        message: "token exists already",
                    });
                }
                yield schema_1.default.User().updateOne({
                    _id: user._id,
                }, {
                    $set: {
                        pushToken: token,
                    },
                });
                return response.status(200).send("token saved");
            }
            catch (error) {
                console.log(error.toString(), "========");
                return response.status(500).send({
                    message: "Something went wrong",
                });
            }
        });
    }
    //get user
    static userDetails(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            console.log(uid);
            try {
                const user = yield schema_1.default.User().findOne({ _id: uid });
                console.log(user);
                if (user && Object.keys(user).length) {
                    response.status(200).send({
                        user,
                    });
                    console.log(user);
                }
                else {
                    response.status(404).send({
                        message: "Cannot find details for this user",
                    });
                    console.log("not found");
                }
            }
            catch (error) {
                return response.status(500).send({
                    message: "Something went wrong",
                });
            }
        });
    }
    //get activity
    //send email function
    static sendMail(email, message, subject) {
        try {
            const msg = {
                to: email,
                from: "My UOM App",
                subject,
                html: `<p> ${message}</p>`,
            };
            transporter.sendMail(msg, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("Email sent: " + info);
                }
            });
        }
        catch (error) {
            console.log(error.toString());
        }
    }
}
exports.default = UserController;
