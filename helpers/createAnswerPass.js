const Answer = require('../models/answer')
/* istanbul ignore file */
module.exports = {
    createAnswerPass (setSoalId) {
        if(process.env.NODE_ENV === 'test') {
            return Answer.create({
                name: "Name Student",
                  answers: {
                      "1":"A",
                      "2":"A",
                      "3":"E",
                      "4":"A",
                      "5":"B",
                  },
                  setSoalId,
                  imageUrl : 'urlfake'
            })
            .then(data => {
                return data
            })
            .catch(err => {
                return err
            })
        }
    }
}