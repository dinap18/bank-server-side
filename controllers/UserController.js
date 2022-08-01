const userService = require("../services/UserService");

module.exports = class User{

    static async apiGetAllUsers(req, res, next){
        try {
            const users = await userService.getAllUsers();
            if(!users){
                res.status(404).json("There are no users yet!")
            }
            res.json(users);
        } catch (error) {
            res.status(500).json({error: error})
        }

    }

    static async apiGetUserById(req, res, next){
        try {
            let id = req.params.id || {};
            const user = await userService.getUserById(id);
            res.json(user);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }static async apiGetUserByUsername(req, res, next){
        try {
            let id = req.params.id || {};
            const user = await userService.getUserByUsername(id);
            res.json(user);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }static async apiGetUserByEmail(req, res,id){
        try {
            const user = await userService.getUserByEmail(id);
            res.json(user);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

    static async apiCreateUser(req, res, next){
        try {

            const createdUser =  await userService.createUser(req.body);
            res.json(createdUser);
        } catch (error) {
            console.log(error)
            res.status(500).json({error: error});
        }
    }

    static async apiUpdateUser(req, res, next) {
        try {
            const userId = req.params.id;
            const updatedUser = await userService.updateUser(userId,req.body);

            if (updatedUser.modifiedCount === 0) {
                throw new Error("Unable to update user, error occurred");
            }

            res.sendStatus(200);

        } catch (error) {
            console.log(error)
            res.sendStatus(500);
        }
    }

    static async apiDeleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            const deleteResponse = await userService.deleteUser(userId)
            res.json(deleteResponse);
        } catch (error) {
            res.status(500).json({error: error})
        }
    }

}