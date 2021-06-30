"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema: MongooseSchema } = mongoose_1.default;
class Schema {
    static User() {
        const UserSchema = new mongoose_1.default.Schema({
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
        });
        const User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
        return User;
    }
    static Post() {
        const PostSchema = new mongoose_1.default.Schema({
            post: String,
            pic: String,
            file: String,
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            createdAt: String,
            postedBy: String,
            postedByPic: String,
            time: Number,
            level: String,
            department: String
        });
        const Post = mongoose_1.default.models.Post || mongoose_1.default.model('Post', PostSchema);
        return Post;
    }
    static Comment() {
        const CommentSchema = new mongoose_1.default.Schema({
            comment: String,
            pic: String,
            file: String,
            likes: Number,
            dislikes: Number,
            post: { type: MongooseSchema.Types.ObjectId, ref: 'Post' },
            user: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
            createdAt: String,
            postedBy: String,
            postedBypic: String,
            likedBy: [String],
            dislikedBy: [String],
            time: Number
        });
        const Comment = mongoose_1.default.models.Comment || mongoose_1.default.model('Comment', CommentSchema);
        return Comment;
    }
    static Guide() {
        const GuideSchema = new mongoose_1.default.Schema({
            location: String,
            pic: String,
            name: String,
            category: String
        });
        const Guide = mongoose_1.default.models.Guide || mongoose_1.default.model('Guide', GuideSchema);
        return Guide;
    }
}
exports.default = Schema;
