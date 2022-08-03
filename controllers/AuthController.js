const authService = require("../services/AuthService");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// fait le lien entre routes- url and service- parle avec mongoDb
module.exports = class Auth {

    static async apiLogin(req, res, next) {
        try {

            let user = undefined;


            await authService.login(req).then((result) => {
                user = result;
            })

            if (user !== null) {
                res.json({status: 200, message: "user found!!!", data: user});
            } else {
                res.json({status: 403, message: "Invalid username/password!!!", data: null});
            }


        } catch (error) {
            res.status(500).json({error: error})
        }

    }
}