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
            dept: String,
            isConfirmed: Boolean,
            createdAt: String,
        });
        const User = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
        return User;
    }
}
exports.default = Schema;
