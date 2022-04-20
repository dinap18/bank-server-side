const levCoin = require("../models/")("LevCoin");
const ObjectId = require('mongodb').ObjectId;

module.exports = class LevCoinService {
    static async getAllLevCoins() {
        try {
            return await levCoin.find();
        } catch (error) {
            console.log(`Could not fetch LevCoins ${error}`)
        }
    }

    static async createLevCoin(data) {
        try {
            return await levCoin.create(data);
        } catch (error) {
            console.log(error);
        }

    }

    static async getLevCoinById(levCoinId) {
        try {
            return await levCoin.findById({_id: levCoinId});
        } catch (error) {
            console.log(`User not found. ${error}`)
        }
    }

    static async updateLevCoin(updatedLevCoin, id) {
        try {
            const query = {_id: new ObjectId(id)}
            return await levCoin.updateOne(
                query, updatedLevCoin
            );
        } catch (error) {
            console.log(`Could not update LevCoin ${error}`);

        }
    }

    static async deleteLevCoin(levCoin) {
        try {
            return await levCoin.findOneAndDelete(levCoin);
        } catch (error) {
            console.log(`Could not delete LevCoin ${error}`);
        }

    }
}