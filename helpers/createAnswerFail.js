const Answer = require('../models/answer')
/* istanbul ignore file */
module.exports = {
    createAnswerFail (setSoalId) {
        if(process.env.NODE_ENV === 'test') {
            return Answer.create({
                name: "Name Student",
                  answers: {
                      "1":"E",
                      "2":"E",
                      "3":"E",
                      "4":"E",
                      "5":"C",
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