import { Request, Response, NextFunction} from 'express';
import jwt from "jsonwebtoken";
//import Validator from './validator/Validator';

export default class MiddleWare {

  static SignupMiddleware(req: Request, res: Response, next: NextFunction) {
    let { email, password, fullname, cpassword } = req.body;

    email = email.trim();
    password = password.trim();
    fullname = fullname.trim();



    let errors: {[error: string]: string}[] = []
    if (!email) {
      errors = [...errors, {
        email: 'You have not entered an email'
      }]
    }
    if (password.trim().length < 6) {
      errors = [...errors, {
        password: 'Password is too short'
      }]
    }


    if(cpassword !== password){
      errors = [...errors, {
        cpassword: 'Passwords do not match'
      }]
    }

  



    if(!( (/^[a-zA-Z .'-]+\s[a-zA-Z .'-]+$/.test(fullname.trim()))  )){
      errors =[
        ...errors, {
        errorMessage: 'Please enter your first and last name',
        }
     ]
    }


  


  


    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }

  static signinMiddleware (req: Request, res: Response, next: NextFunction) {
    let { email, password,  } = req.body;

    email = email.trim();
    password = password.trim();

    let errors: {[error: string]: string}[] = []
    if (!email) {
      errors = [...errors, {
        email: 'You have not entered an email'
      }]
    }

    if (password.trim().length < 6) {
      errors = [...errors, {
        password: 'Password is too short'
      }]
    }

    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }
  

  static authorization (req: any, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token'];
    if (token && process.env.SECRET) {
      jwt.verify(token, process.env.SECRET, (err: any, decoded: any) => {
        if (err) {
          res.status(403).send({
            message: 'Expired session. Please login'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      res.status(403).send({
        message: 'Expired session. Please login'
      });
    }
  }

  
}