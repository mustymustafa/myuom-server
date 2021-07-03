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
class CampusController {
    //add location
    static addLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, location, pic, category } = request.body;
            const loc = yield schema_1.default.Guide().findOne({ name: name });
            if (!loc) {
                try {
                    yield schema_1.default.Guide().create({
                        name: name,
                        pic: pic,
                        location: location,
                        category: category
                    });
                    response.status(201).send({
                        message: 'Location added successfully'
                    });
                }
                catch (error) {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            else {
                response.status(404).send({ message: 'location already exists' });
            }
        });
    }
    //get locations
    static getLocations(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const locations = yield schema_1.default.Guide().find({});
                response.status(201).send({
                    locations
                });
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //get specific locations
    static getLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category } = request.body;
            try {
                const locations = yield schema_1.default.Guide().find({ category: category });
                response.status(201).send({
                    locations
                });
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
    //update location
    static updateLocation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name } = request.body;
            try {
                const location = yield schema_1.default.Guide().find({ _id: id });
                if (location) {
                    yield schema_1.default.Guide().updateOne({
                        _id: id
                    }, {
                        $set: {
                            name: name
                        }
                    });
                    response.status(201).send({
                        message: 'updated'
                    });
                }
                else {
                    return response.status(500).send({
                        message: 'Something went wrong'
                    });
                }
            }
            catch (error) {
                return response.status(500).send({
                    message: 'Something went wrong'
                });
            }
        });
    }
}
exports.default = CampusController;
