const User = require('../models/user')

class ControllerUser {
    static login(req, res, next) {
        
        let user = { ...req.body }
        User
            .findOne({email : user.email})
            .then(data => {
                if (!data) {
                    User.create(user)
                        .then((user) => {
                            res.status(201).json(user)
                        })
                        .catch(next)
                } else {
                    res.status(200).json(user)
                }
            })
            .catch(next)
    }
}
module.exports = ControllerUser