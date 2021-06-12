import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from "express";

import request, { post } from 'request';

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

            console.log(uid)
            console.log(post)
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

    const {uid, level, dept} = request.body;
    //console.log("level:" + level)

              const user = await Schema.User().findOne({_id: uid});

              if(user){
  try {
      const posts = await Schema.Post().find({level: user.level,
                        department: user.department}).sort({_id: -1});

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

      //show user posts
     static async getMyPosts(request: Request, response: Response){

    const {uid} = request.params;
    console.log(uid)

  const user = await Schema.User().findOne({_id: uid});
        if(user){
    try {
      const posts = await Schema.Post().find({user: uid}).sort({_id: -1});
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
                        postedBypic: user.pic,
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
      const comments = await Schema.Comment().find({post: pid}).sort({_id: -1});
        //find best anser
        const best =  await Schema.Comment().findOne({post: pid}).sort({likes: -1});
        response.status(200).send({
          comments, best })
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  }

 // like comment
     static async likeComment(request: Request, response: Response){

    const {cid, uid} = request.body;
    
      const user = await Schema.User().findOne({_id: uid});
      const comments = await Schema.Comment().findOne({_id: cid});
      const likedBy = comments.likedBy
      const addLike = likedBy.push(user.name)
      console.log(likedBy)
      console.log(addLike)
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
          likedBy: likedBy.push(user.name),
        }
      });
      return response.status(200).send({message: "like added"});
 
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

    const {cid, uid} = request.body;
    
      const user = await Schema.User().findOne({_id: uid});
        const comments = await Schema.Comment().findOne({_id: cid});
      const dislikedBy = comments.likedBy
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
        dislikedBy: dislikedBy.push(user.name)
        }
      });
      return response.status(200).send({message: "disliked"});
 
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  } else {
                response.status(404).send({message: 'user not found'})
            }





        }

//delete comment and post

     static async deletePost(request: Request, response: Response){

    const {pid, uid} = request.body;
    
      const user = await Schema.User().findOne({_id: uid});
      const post = await Schema.Post().findOne({_id: pid});

            if(user && post){
    try {
     await Schema.Post()
        .deleteOne({
          _id: pid,
        });
      return response.status(200).send({message: "post deleted"});
 
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  } else {
                response.status(404).send({message: 'user or post not found'})
            }





        }

     static async deleteComment(request: Request, response: Response){

    const {cid, pid, uid} = request.body;
    
      const user = await Schema.User().findOne({_id: uid});
      const post = await Schema.Post().findOne({_id: pid});
      const comment = await Schema.Comment().findOne({_id: cid});

            if(user && post && comment){
    try {
     await Schema.Comment()
        .deleteOne({
          _id: cid,
        });
      return response.status(200).send({message: "comment deleted"});
 
    } catch (error) {
      return response.status(500).send({
        message: 'Something went wrong'
      })
    }
  } else {
                response.status(404).send({message: 'user or post not found'})
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