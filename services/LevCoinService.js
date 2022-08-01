const levCoin = require("../models/")("LevCoin");
const ObjectId = require('mongodb').ObjectId;
const {AuditLogBlockchain} = require("../services/AuditLogChainService");


module.exports = class LevCoinService {
    static async getAllLevCoins() {
        try {
            return await levCoin.find();
        } catch (error) {
            throw new Error(`Could not fetch LevCoins ${error}`)
        }
    }

    static async getCurrentLevCoinValue(currency) {
        let value = 0;
        const levCoins = await this.getAllLevCoins();


        if (levCoins !== undefined) {

            value = 1 - (levCoins.length / 100)
        } else {
            value = 1
        }
        if (value <= 0) {
            value = 0.01
        }

        if (currency === "ILS")
        {
            value = await Currency.convertCurrency("USD", "ILS", value)
        }

        return value;
    }

    static async createLevCoin(data) {
        try {
            const levCoins = await this.getAllLevCoins();

            if (levCoins !== undefined) {
                data.value = 1 - (levCoins.length / 100)
            } else {
                data.value = 1
            }
            if (data.value <= 0) {
                data.value = 0.01
            }

            let blockChain = new AuditLogBlockchain();
            await blockChain.initialize();

            await blockChain.createTransaction(data);

            let status = await blockChain.checkChainValidity();

            if (!status) {
                throw new Error("error validating loan");
            }

            return await levCoin.create(data);
        } catch (error) {
            throw new Error(error);
        }

    }

    static async getLevCoinByUserId(userID, currency) {
        try {
            let sum = 0;
            await levCoin.find({user: userID}).then(docs => {
                if (docs) {

                    for (let i = 0; i < docs.length; i++) {
                        sum += docs[i].value
                    }

                }
            });
            if (currency === "ILS") {
                sum = await Currency.convertCurrency("USD", "ILS", sum)
            }
            return sum

        } catch (error) {
            throw new Error(`User not found. ${error}`)
        }
    }


    static async updateLevCoin(updatedLevCoin, id) {
        try {
            const query = {_id: new ObjectId(id)}
            return await levCoin.updateOne(query, updatedLevCoin);
        } catch (error) {
            throw new Error(`Could not update LevCoin ${error}`);

        }
    }

    static async deleteLevCoin(levCoin) {
        try {
            return await levCoin.findOneAndDelete(levCoin);
        } catch (error) {
            throw new Error(`Could not delete LevCoin ${error}`);
        }

    }
}