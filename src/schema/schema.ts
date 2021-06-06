import mongoose from 'mongoose';

const {Schema: MongooseSchema} = mongoose;

class Schema {
    static User() {
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            pushToken: String,
            confirmationCode: String,
            pic: String,
            level: String,
            department: String,
            isConfirmed: Boolean,
          
            createdAt: String,
        })
        const User = mongoose.models.User || mongoose.model('User', UserSchema)
        return User;
    }

       static Post() {
        const PostSchema = new mongoose.Schema({
            post: String,
            pic: String,
            file: String,
            user: {type: MongooseSchema.Types.ObjectId, ref: 'User'},
            createdAt: String,
            postedBy: String,
            postedBypic: String,
             time: Number
        })
        const Post = mongoose.models.Post || mongoose.model('Post', PostSchema)
        return Post;
    }

       static Comment() {
        const CommentSchema = new mongoose.Schema({
            comment: String,
            pic: String,
            file: String,
            likes: Number,
            dislikes: Number,
            post: {type: MongooseSchema.Types.ObjectId, ref:'Post'},
            user: {type: MongooseSchema.Types.ObjectId, ref: 'User'},
            createdAt: String,
            postedBy: String,
            postedBypic: String,
            likedBy: String,
            dislikedBy: String,
            time: Number
        })
        const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema)
        return Comment;
    }

}

export default Schema;