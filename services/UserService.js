const bcrypt = require("bcrypt");
const user = require("../models/")("User");
const ObjectId = require('mongodb').ObjectId;
const levCoinService = require('../services/LevCoinService')
const {sendMail} = require("../gmail");

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

            const fileAttachments = [
                {
                    filename: 'websites.pdf',
                    path: 'https://www.labnol.org/files/cool-websites.pdf',
                },
            ];

            const options = {
                to: 'chainbucks11@gmail.com',
                cc: createdUser.email,
                replyTo: 'chainbucks11@gmail.com',
                subject: `Hello ${createdUser.firstName} 🚀`,
                text: 'Chain Bucks',
                html: `<p>🙋🏻‍♀️  &mdash; Welcome to <b>Chain Bucks</b> once an admin approves your request you will be able to use our unique currency, LevCoin and enjoy our banking services.</p><br> <br> <p>We hope to see you soon! 💰</p>`,
                textEncoding: 'base64',
                headers: [
                    {key: 'X-Application-Developer', value: 'Amit Agarwal'},
                    {key: 'X-Application-Version', value: 'v1.0.0.2'},
                ],
            };
            await sendMail(options);


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

    static async getUsernameById(userId) {
        try {
            return await user.findById({_id: new ObjectId(userId)}, {'username': 1});

        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }

    static async getUserByUsername(userId) {
        try {
            return await user.findOne({username: userId});
        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }static async getUserByEmail(userId) {
        try {
            return await user.findOne({email: userId});
        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }

    static async updateUser(id, updatedUser) {
        try {
            const query = {_id: new ObjectId(id)}
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