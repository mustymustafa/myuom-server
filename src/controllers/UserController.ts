import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import request from 'request';

import Schema from '../../schema/schema';


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
          const {
      fullname, email,  password, cpassword
    } = request.body;

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