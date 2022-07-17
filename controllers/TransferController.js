const TransferService = require("../services/TransferService");

module.exports = class Transfer {

    static async apiGetAllTransfers(req, res, next) {
        try {
            const transfers = await TransferService.getAllTransfers();
            if (!transfers) {
                res.status(404).json("There are no transfers yet!")
            }
            res.json(transfers);
        } catch (error) {
            res.status(500).json({error: error})
        }

    }

    static async apiGetTransferById(req, res, next) {
        try {
            let id = req.params.id || {};
            const transfers = await TransferService.getTransferById(id);
            res.json(transfers);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiGetTransfersToById(req, res, next) {
        try {
            let id = req.params.id || {};
            const transfers = await TransferService.getTransfersToById(id);
            res.json(transfers);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiGetTransfersFromById(req, res, next) {
        try {
            let id = req.params.id || {};
            const transfers = await TransferService.getTransfersFromById(id);
            res.json(transfers);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiCreateTransfer(req, res, next) {
        try {

            const createdTransfer = await TransferService.createTransfer(req.body);
            res.json(createdTransfer);
        } catch (error) {
            res.status(500).json({error: error});
        }
    }

}