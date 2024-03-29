const levCoinService = require("../services/LevCoinService");

module.exports = class LevCoin {

    static async apiGetAllLevCoins(req, res, next) {
        try {
            const levCoins = await levCoinService.getAllLevCoins();
            if (!levCoins) {
                res.status(404).json("There are no LevCoins yet!")
            }
            res.json(levCoins);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error})
        }

    }

    static async apiGetLevCoinByUserId(req, res, next) {
        try {
            let id = req.params.id || {};
            const user = await levCoinService.getLevCoinByUserId(id, req.body.currency);
            res.json(user);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiCreateLevCoin(req, res, next) {
        try {

            const createdLevCoin = await levCoinService.createLevCoin(req.body);
            res.json(createdLevCoin);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error});
        }
    }

    static async apiGetLevCoinValue(req, res, next) {
        try {
            let currency = req.params.currency || "USD";
            const levCoinValue = await levCoinService.getCurrentLevCoinValue(currency);
            res.json(levCoinValue);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error});
        }
    }

    static async apiUpdateLevCoin(req, res, next) {
        try {
            const id = req.params.id;
            const updatedLevCoin = await levCoinService.updateLevCoin(req.body, id);

            if (updatedLevCoin.modifiedCount === 0) {
                throw new Error("Unable to update LevCoin, error occurred");
            }

            res.sendStatus(200);

        } catch (error) {
            res.sendStatus(500);
        }
    }

    static async apiDeleteLevCoin(req, res, next) {
        try {
            const id = req.params.id;
            const deleteResponse = await levCoinService.deleteLevCoin(id)
            res.json(deleteResponse);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

}