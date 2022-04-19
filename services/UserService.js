const user = require("../models/")("User");
const ObjectId = require('mongodb').ObjectId;

module.exports = class UserService{
    static async getAllUsers(){
        try {
            return await user.find();
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }

    static async createUser(data){
        try {
            return await user.create(data);
        } catch (error) {
            console.log(error);
        }

    }
    static async getUserById(userId){
        try {
            return  await user.findById({_id: userId});
        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }

    static async updateUser(updatedUser,id){
        try {
            const query = {_id:new ObjectId(id)}
            return await user.updateOne(
                query, updatedUser
            );
        } catch (error) {
            console.log(`Could not update User ${error}` );

        }
    }

    static async deleteUser(userId){
        try {
            return await user.findOneAndDelete(userId);
        } catch (error) {
            console.log(`Could not delete user ${error}`);
        }

    }
}