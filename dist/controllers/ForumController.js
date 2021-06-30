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
const schema_1 = __importDefault(require("../schema/schema"));
const expo_server_sdk_1 = require("expo-server-sdk");
const expo = new expo_server_sdk_1.Expo();
//date initialization
const now = new Date();
const month = now.getMonth() + 1;
const day = now.getDate();
const year = now.getFullYear();
const today = month + '/' + day + '/' + year;
class ForumController {
    //add post
    static makePost(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, post, file, pic, level, dept } = request.body;
            console.log(uid);
            console.log(post);
            const user = yield schema_1.default.User().findOne({ _id: uid });
            if (user) {
                try {
                    yield schema_1.default.Post().create({
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
                    });
                    response.status(201).send({
                        message: 'Post added successfully'
                    });
                    //send notification
                    const get_users = yield schema_1.default.User().find({ department: dept, level: level }).where({ pushToken: { $exists: true } });
                    console.log("users:" + get_users);
                    get_users.map(users => {
                        console.log("tokens:" + users.pushToken);
                        let chunks = expo.chunkPushNotifications([{
                                "to": [users.pushToken],
                                "sound": "default",
                                "title": "New Post added",
                                "body": "A new post was added to the forum"
                            }]);
                        let tickets = [];
                        (() => __awaiter(this, void 0, void 0, function* () {
                            for (let chunk of chunks) {
                                try {
                                    let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                                    console.log(ticketChunk);
                                    tickets.push(...ticketChunk);
                                }
                                catch (error) {
                                    console.error(error);
                                }
                            }
                        }))();
                    });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                return response.status(404).send({ message: 'user not found' });
            }
        });
    }
    //show posts
    static getPosts(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, level, dept } = request.body;
            //console.log("level:" + level)
            const user = yield schema_1.default.User().findOne({ _id: uid });
            if (user) {
                try {
                    const posts = yield schema_1.default.Post().find({ level: user.level,
                        department: user.department }).sort({ _id: -1 });
                    response.status(200).send({
                        posts
                    });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user not found' });
            }
        });
    }
    //show user posts
    static getMyPosts(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = request.params;
            console.log(uid);
            const user = yield schema_1.default.User().findOne({ _id: uid });
            if (user) {
                try {
                    const posts = yield schema_1.default.Post().find({ user: uid }).sort({ _id: -1 });
                    response.status(200).send({
                        posts
                    });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user not found' });
            }
        });
    }
    //get post
    static getPost(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pid } = request.params;
            console.log(pid);
            try {
                const post = yield schema_1.default.Post().findOne({ _id: pid });
                console.log(post);
                if (post && Object.keys(post).length) {
                    response.status(200).send({
                        post
                    });
                    console.log(post);
                }
                else {
                    response.status(404).send({
                        message: 'Cannot find details for this post'
                    });
                    console.log("not found");
                }
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //add comment
    static addComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pid, uid, comment, file, pic } = request.body;
            const post = yield schema_1.default.Post().findOne({ _id: pid });
            const user = yield schema_1.default.User().findOne({ _id: uid });
            if (post) {
                try {
                    yield schema_1.default.Comment().create({
                        user: uid,
                        post: pid,
                        comment: comment,
                        file: file,
                        pic: pic,
                        createdAt: today,
                        postedBy: user.name,
                        postedBypic: user.pic,
                        time: now.getTime()
                    });
                    response.status(201).send({
                        message: 'comment added successfully'
                    });
                    const findUser = yield schema_1.default.User().findOne({ _id: post.user });
                    let chunks = expo.chunkPushNotifications([{
                            "to": findUser.pushToken,
                            "sound": "default",
                            "title": "New Comment added",
                            "body": "A new comment was added to your post"
                        }]);
                    let tickets = [];
                    (() => __awaiter(this, void 0, void 0, function* () {
                        for (let chunk of chunks) {
                            try {
                                let ticketChunk = yield expo.sendPushNotificationsAsync(chunk);
                                console.log(ticketChunk);
                                tickets.push(...ticketChunk);
                            }
                            catch (error) {
                                console.error(error);
                            }
                        }
                    }))();
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'post not found' });
            }
        });
    }
    //show comments
    static getComments(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pid } = request.params;
            console.log(pid);
            try {
                const comments = yield schema_1.default.Comment().find({ post: pid }).sort({ _id: -1 });
                //find best anser
                const best = yield schema_1.default.Comment().findOne({ post: pid }).sort({ likes: -1 });
                response.status(200).send({
                    comments, best
                });
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    // like comment
    static likeComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cid, uid } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            const comments = yield schema_1.default.Comment().findOne({ _id: cid });
            const likedBy = comments.likedBy;
            const addLike = likedBy.push(user.name);
            console.log(likedBy);
            console.log(addLike);
            if (user) {
                try {
                    yield schema_1.default.Comment()
                        .updateOne({
                        _id: cid,
                    }, {
                        $inc: {
                            likes: 1,
                        }
                    });
                    yield schema_1.default.Comment()
                        .updateOne({
                        _id: cid,
                    }, {
                        $set: {
                            likedBy: likedBy.push(user.name),
                        }
                    });
                    return response.status(200).send({ message: "like added" });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user not found' });
            }
        });
    }
    //dislike comment
    static dlikeComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cid, uid } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            const comments = yield schema_1.default.Comment().findOne({ _id: cid });
            const dislikedBy = comments.likedBy;
            if (user) {
                try {
                    yield schema_1.default.Comment()
                        .updateOne({
                        _id: cid,
                    }, {
                        $inc: {
                            dislikes: 1,
                        }
                    });
                    yield schema_1.default.Comment()
                        .updateOne({
                        _id: cid,
                    }, {
                        $set: {
                            dislikedBy: dislikedBy.push(user.name)
                        }
                    });
                    return response.status(200).send({ message: "disliked" });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user not found' });
            }
        });
    }
    //delete comment and post
    static deletePost(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { pid, uid } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            const post = yield schema_1.default.Post().findOne({ _id: pid });
            if (user && post) {
                try {
                    yield schema_1.default.Post()
                        .deleteOne({
                        _id: pid,
                    });
                    return response.status(200).send({ message: "post deleted" });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user or post not found' });
            }
        });
    }
    static deleteComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cid, pid, uid } = request.body;
            const user = yield schema_1.default.User().findOne({ _id: uid });
            const post = yield schema_1.default.Post().findOne({ _id: pid });
            const comment = yield schema_1.default.Comment().findOne({ _id: cid });
            if (user && post && comment) {
                try {
                    yield schema_1.default.Comment()
                        .deleteOne({
                        _id: cid,
                    });
                    return response.status(200).send({ message: "comment deleted" });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'user or post not found' });
            }
        });
    }
    //upload file
    static uploadfile(req, res) {
        console.log(req.file.originalname.split(' '));
        const parts = req.file.originalname.split(' ');
        const find = parts[0];
        console.log(find);
        res.json(req.file);
    }
}
exports.default = ForumController;
