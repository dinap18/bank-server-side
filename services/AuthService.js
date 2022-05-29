const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/")("User");

module.exports = class AuthService {
    static async login(req) {
        try {
            const userInfo = await user.findOne({username: req.body.username});

            if (bcrypt.compareSync(req.body.password, userInfo.password)) {

                const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '1h'});

                return {token: token};
            }
            return null;

        } catch (error) {
            throw new Error("user not found")
        }
    }


}