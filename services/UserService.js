const bcrypt = require("bcrypt");
const user = require("../models/")("User");
const ObjectId = require('mongodb').ObjectId;
const levCoinService = require('../services/LevCoinService')

module.exports = class UserService {
    static async getAllUsers() {
        try {
            return await user.find();
        } catch (error) {
            console.log(`Could not fetch users ${error}`)
        }
    }

    static async createUser(data) {
        try {
            const saltOrRounds = 10
            const hashedPassword = await bcrypt.hash(data.password, saltOrRounds)
            data.password = hashedPassword
            let createdUser = await user.create(data);
            if (data.accountCurrency == "LEVCOIN") {
                for (let i = 0; i < data.accountBalance; i++) {
                    await levCoinService.createLevCoin(createdUser._id)
                }
            }
            return createdUser
        } catch (error) {
            console.log(error);
        }

    }

    static async getUserById(userId) {
        try {
            return await user.findById({_id: new ObjectId(userId)});
        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }

    static async updateUser(updatedUser, id) {
        try {
            const query = {_id: new ObjectId(id)}
            if (updatedUser["accountBalance"] != undefined) {
                delete updatedUser["accountBalance"]
            }
            return await user.updateOne(
                query, updatedUser
            );
        } catch (error) {
            console.log(`Could not update User ${error}`);

        }
    }

    static async deleteUser(userId) {
        try {
            return await user.findOneAndDelete(userId);
        } catch (error) {
            console.log(`Could not delete user ${error}`);
        }

    }

}