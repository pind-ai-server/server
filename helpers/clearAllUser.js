const User = require('../models/user')
/* istanbul ignore file */
module.exports = {
    clearAllUser () {
        if(process.env.NODE_ENV === 'test') {
            return User
                .deleteMany({})
                .then(function (){
                    console.log('All users deleted!')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}