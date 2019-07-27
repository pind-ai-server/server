const { User } = require('../models/user')

module.exports = {
    clearAllUser (done) {
        if(processa.env.NODE_ENV === 'test') {
            return User
                .deleteMany({})
                .then(function (){
                    console.log('All users deleted!')
                    done()
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}