import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";



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









class CampusController {


    //add location
    static async addLocation(request:Request, response: Response){
        const {name, location, pic, category} = request.body;

       
              const loc = await Schema.Guide().findOne({name: name});
            if(!loc){
                try{
                    await Schema.Guide().create({
                       name: name,
                       pic: pic,
                       location: location,
                       category: category
                    })
                       response.status(201).send({
              message: 'Location added successfully'
                     });

                } catch (error){
                      return response.status(500).send({
                    message: 'Something went wrong'
      })
                }

            } else {
                response.status(404).send({message: 'location already exists'})
            }
    }

    //get locations
     static async getLocations(request:Request, response: Response){
                try{
                        
              const locations = await Schema.Guide().find();
                       response.status(201).send({
                           locations
                     });

                } catch (error){
                      return response.status(500).send({
                    message: 'Something went wrong'
      })
                }

            
    }

    //get specific locations
     static async getLocation(request:Request, response: Response){
        const {category} = request.body        
        try{
                        
              const locations = await Schema.Guide().find({category: category});
                       response.status(201).send({
                           locations
                     });

                } catch (error){
                      return response.status(500).send({
                    message: 'Something went wrong'
      })
                }

            
    }

}

export default CampusController;