import mongoose from 'mongoose';

const {Schema: MongooseSchema} = mongoose;


class Schema {
 static User() {
        const UserSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            pushToken: String,
            pic: String,
            confirmationCode: String,
            level: String,
            department: String,
            isConfirmed: Boolean,
            createdAt: String,
        })
        const User = mongoose.models.User || mongoose.model('User', UserSchema)
        return User;
    }


}


export default Schema;