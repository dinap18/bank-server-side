const express = require("express");
const router = express.Router();
const Message = require("../models/")("Message");

router.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        console.log(messages)
        res.json(messages);
    })
})
router.post('/myMessages', (req, res) => {
    console.log("from" + req.body.from)
    console.log("to" + req.body.to)
    if (req.body.to)
        Message.find({
            $or: [{from: req.body.from, to: req.body.to}, {
                from: req.body.to,
                to: req.body.from
            }]
        }, (err, messages) => {
            if (err) console.log(err)
            console.log(messages.count)
            res.json(messages);
        })
    else {
        Message.find({$or: [{from: req.body.from}, {to: req.body.from}]}, (err, messages) => {
            if (err) console.log(err)
            console.log(messages.count)
            res.json(messages);
        })
    }
})

router.post('/messages', (req, res) => {
    var message = new Message(req.body);
    console.log(req.body)
    message.save((err) => {
        if (err)
            res.sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})


module.exports = router;