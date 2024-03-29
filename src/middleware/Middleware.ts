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


     if (
       !/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(manchester)\.ac\.uk$/.test(
         email
       )
     ) {
       return res.status(400).send({
         message: "Please enter a correct UoM email address",
       });
     }

     if (password.trim().length < 6) {
       return res.status(400).send({
         message: "Password is too short",
       });
     }

    if(cpassword !== password){
          return res.status(400).send({
            message: "Passwords do not match",
          });
  
    }

  



    if(!( (/^[a-zA-Z .'-]+\s[a-zA-Z .'-]+$/.test(fullname.trim()))  )){
      
       return res.status(400).send({
         message: "Please enter your first and last name",
       });
  
    }
    if (errors.length) {
      return res.status(400).send({
        errors
      });
    }
    next();
  }

  static signinMiddleware (req: Request, res: Response, next: NextFunction) {
    let { email, password, } = req.body;

    email = email.trim();
    password = password.trim();

    let errors: {[error: string]: string}[] = []

     if( !email ||  !password) {
          return res.status(400).send({
            message: "Please provide all information",
          });
  

      }

     if (!(/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(manchester)\.ac\.uk$/.test(email))) {
          return res.status(400).send({
            message: "Please enter a correct UoM email address",
          });
  
    }

    if (password.trim().length < 6) {
        return res.status(400).send({
          message: 'Password is too short',
        });
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