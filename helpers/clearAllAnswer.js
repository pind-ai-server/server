const Answer = require('../models/answer')
/* istanbul ignore file */
module.exports = {
    clearAllAnswer () {
        if(process.env.NODE_ENV === 'test') {
            return Answer
                .deleteMany({})
                .then(function (){
                    console.log('All answers deleted!')
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}