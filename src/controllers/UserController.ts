import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import request from 'request';

import Schema from '../schema/schema';


import nodemailer from "nodemailer";
import { Expo } from "expo-server-sdk";

const expo = new Expo();

//date initialization
const now = new Date();
const month = now.getMonth() + 1
const day = now.getDate()
const year = now.getFullYear()
const today = month + '/' + day + '/' + year



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: 'musty.mohammed1998@gmail.com',
         pass: process.env.PASS
     }
 });


 class UserController {
    //signup function


    static async signup(request: Request, response: Response){
          const {fullname, email,  password, cpassword} = request.body;

    console.log(request.body);

   try {
      const foundEmail = await Schema.User().find({email: email.trim()});
      if (foundEmail && foundEmail.length > 0) {

        console.log(foundEmail[0])
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
      const message = `Verification code: ${confirmationCode}`
      UserController.sendMail(email.trim(), message, 'User Verification code')
  
      
      await Schema.User().create({
        name: fullname.trim(),
        email: email.trim(),
        password: bcrypt.hashSync(password.trim(), UserController.generateSalt()),
        confirmationCode,
        isConfirmed: false

      });

      response.status(201).send({
        message: 'User created successfully',
        status: 201
      });
    } catch (error) {
      console.log(error.toString());
      response.status(500).send({
        message: "Somenthing went wrong"
      })
    

    }

}

// continue signup
    static async setProfile(request: Request, response: Response){
            const {
      pic, level, department, email
    } = request.body;

    console.log(request.body);
    const foundUser: any = await Schema.User().findOne({ email });

        if (foundUser && Object.keys(foundUser).length > 0) {
      console.log(foundUser);
      try {
        await Schema.User().updateOne({
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
      } catch (error) {
        console.log(error.toString());
        response.status(500).send({
          message: 'something went wrong'
        });
      }
    }

    }


//confirmation
  //confrimation code
  static async confirm (request: Request, response: Response) {
    const {
      email, confirmationCode
    } = request.body;

    const foundUser:any = await Schema.User().findOne({email});

    if (foundUser && Object.keys(foundUser).length > 0) {
      if (foundUser.confirmationCode !== confirmationCode) {
        return response.status(403).send({
          message: 'Incorrect confirmation code'
        });
      }
      try {
        const dt = new Date();
        const createdAt = dt.toLocaleDateString();
        console.log(createdAt)

        await Schema.User().updateOne({
          _id: foundUser._id
        }, {
          $set: {
            isConfirmed: true,
            createdAt: createdAt
          }
        });

        foundUser.isConfirmed = true;
        return response.status(200).send({
          token: UserController.generateToken(foundUser)
        });
      } catch (error) {
        console.log(error.toString());
        response.status(500).send({
          message: 'something went wrong'
        });
      }
    } else {
      return response.status(401).send({
        message: 'Incorrect Username or Password'
      });
    }
  }

  //send otp
  static async resendOtp(request: Request, response: Response) {
    const { email} = request.body;
    console.log(email)

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.User()
        .updateOne({
          email,
        }, {
        $set: {
          confirmationCode
        }
      });
      const message = `Token: ${confirmationCode}`;
      UserController.sendMail(email, message, 'Confirmation Code');
      response.status(200).send({
        message: 'Please check your mailbox for token'
      });
      return;
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }

  //forgot password
  static async forgotPassword (request: Request, response: Response) {
    const {
      email
    } = request.body;
  
    const user = await Schema.User().findOne({email: email.trim()});
    if (!user) {
      return response.status(404).send({
        message: 'User does not exist'
      });
    }

    const confirmationCode = String(Date.now()).slice(9, 13);
    try {
      await Schema.User()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          confirmationCode
        }
      });
      const message = `Token: ${confirmationCode}`;
      UserController.sendMail(user.email, message, 'Password change');
      return response.status(200).send({
        message: 'Please check your email for token'
      });
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }

  //change password
  static async changePassword (request: Request, response: Response) {
    const {
      confirmationCode,
      password,
      email
    } = request.body;
    if (!confirmationCode || !confirmationCode.trim()) {
      return response.status(400).send({
        message: "Token is required"
      });
    }
    if (!password || !password.trim()) {
      return response.status(400).send({
        message: "Password is required"
      });
    }
    const user = await Schema.User().findOne({email: email.trim()});
    if (!user) {
      return response.status(404).send({
        message: 'User does not exist'
      });
    }
    if (user.confirmationCode !== confirmationCode) {
      return response.status(403).send({
        message: "Incorrect token code"
      });
    }
    try {
      await Schema.User()
        .updateOne({
          _id: user._id,
        }, {
        $set: {
          password: bcrypt.hashSync(password.trim(), UserController.generateSalt()),
        }
      });
      return response.status(200).send({
        token: UserController.generateToken(user)
      });
    } catch (error) {
        console.log(error.toString(), "========")
        return response.status(500).send({
          message: 'Something went wrong'
        })
    }
  }


  //upload images
  static uploadimage(req: Request, res: Response) {
    const parts = req.file.originalname.split(' ')
    const find = parts[0]
    console.log(find)
    res.json(req.file)
  }
  static async setId(request: Request, res: Response) {


    console.log(request.body)
    try {
      const email = request.body.email
      const image = request.body.image
      console.log(email)
      console.log(image)




      const foundUser: any = await Schema.User().findOne({ email });

      if (foundUser && Object.keys(foundUser).length > 0) {
        console.log(foundUser);

        await Schema.User().updateOne({
          _id: foundUser._id
        }, {
          $set: {
            pic: image

          }
        });


        return res.status(200).send("image set")
      }
    } catch (error) {
      console.log(error.toString());
      res.status(500).send({
        message: 'something went wrong'
      });
    }





  }




  static generateSalt(): string | number {
    return bcrypt.genSaltSync(10);
  }

  //generate token
  static generateToken(user: { _id: string, name: string, email: string, isConfirmed: boolean }) {
    return process.env.SECRET && jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        isConfirmed: user.isConfirmed
      },
      process.env.SECRET, { expiresIn: 100 * 60 * 60 }
    );
  }



//send email function
 static sendMail (email: string, message: string, subject: string) {
    try{
 
      const msg = {
        to: email,
        from: 'My UOM App',
        subject,
        html: `<p> ${message}</p>`
      };
      transporter.sendMail(msg, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info);
        }
      });
    
    } catch (error) {
      console.log(error.toString());
    }
  }


 }

 export default UserController;