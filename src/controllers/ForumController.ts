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









class ForumController {


    //add post
    static async makePost(request:Request, response: Response){
        const {uid, post, file, pic, level, dept} = request.body;


              const user = await Schema.User().findOne({_id: uid});
            if(user){
                try{
                    await Schema.Post().create({
                        user: uid,
                        post: post,
                        file: file,
                        pic: pic,
                        createdAt: today,
                        postedBy: user.name,
                        postedByPic: user.pic,
                        time: now.getTime(),
                        level: level,
                        department: dept,
                    })
                       response.status(201).send({
              message: 'Post added successfully'
                     });

                } catch (error){
                      return response.status(500).send({
                    message: 'Something went wrong'
      })
                }

            } else {
                response.status(404).send({message: 'user not found'})
            }
    }

    //show posts
     static async getPosts(request: Request, response: Response){

    const {pid, level, dept} = request.params;
    //console.log(pid)

    try {
      const posts = await Schema.Post().find({level: level,
                        department: dept}).sort({time: -1});

        response.status(200).send({
          posts })
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  }

      //show user posts
     static async getMyPosts(request: Request, response: Response){

    const {uid} = request.params;
    console.log(uid)

  const user = await Schema.User().findOne({_id: uid});
        if(user){
    try {
      const posts = await Schema.Post().find({user: uid}).sort({time: -1});
        response.status(200).send({
          posts })
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
        } else {
                response.status(404).send({message: 'user not found'})
            }

  }

  //get post
      static async getPost(request: Request, response: Response){

    const {pid} = request.params;
    console.log(pid)

    try {
      const post = await Schema.Post().findOne({_id: pid});
      console.log(post)
      if (post && Object.keys(post).length) {
        response.status(200).send({
          post
        });
        console.log(post)
      } else {
        response.status(404).send({
          message: 'Cannot find details for this post'
        });
        console.log("not found")
      }
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  }


    //add comment
     static async addComment(request:Request, response: Response){
        const {pid, uid, comment, file, pic} = request.body;

              
              const post = await Schema.Post().findOne({_id: pid});
              const user = await Schema.User().findOne({_id: uid});
            if(post){
                try{
                    await Schema.Comment().create({
                        user: uid,
                        post: pid,
                        comment: comment,
                        file: file,
                        pic: pic,
                        createdAt: today,
                         postedBy: user.name,
                        postedByPic: user.pic,
                             time: now.getTime()
                    })
                       response.status(201).send({
              message: 'comment added successfully'
                     });

                } catch (error){
                      return response.status(500).send({
                    message: 'Something went wrong'
      })
                }

            } else {
                response.status(404).send({message: 'post not found'})
            }
    }

        //show comments
     static async getComments(request: Request, response: Response){

    const {pid} = request.params;
    console.log(pid)

    try {
      const comments = await Schema.Comment().find({post: pid}).sort({time: -1});

        response.status(200).send({
          comments })
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  }

 // like comment
     static async likeComment(request: Request, response: Response){

    const {cid, uid} = request.params;
    
      const user = await Schema.User().findOne({_id: uid});
            if(user){
    try {
     await Schema.Comment()
        .updateOne({
          _id: cid,
        }, {
        $inc: {
          likes: 1,
        }
      });

        await Schema.Comment()
        .updateOne({
          _id: cid,
        }, {
        $set: {
          likedBy: user.name,
        }
      });
      return response.status(200).send("like added");
 
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  } else {
                response.status(404).send({message: 'user not found'})
            }





        }
        
        
//dislike comment
   static async dlikeComment(request: Request, response: Response){

    const {cid, uid} = request.params;
    
      const user = await Schema.User().findOne({_id: uid});
            if(user){
    try {
     await Schema.Comment()
        .updateOne({
          _id: cid,
        }, {
        $inc: {
          dislikes: 1,
        }
      });

        await Schema.Comment()
        .updateOne({
          _id: cid,
        }, {
        $set: {
          dislikedBy: user.name,
        }
      });
      return response.status(200).send("disliked");
 
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  } else {
                response.status(404).send({message: 'user not found'})
            }





        }




//upload file
  static uploadfile(req: Request, res: Response) {
    console.log(req.file.originalname.split(' '))
    const parts = req.file.originalname.split(' ')
    const find = parts[0]
    console.log(find)
    res.json(req.file)
  }

        

}

export default ForumController;