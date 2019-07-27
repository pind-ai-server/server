const SetSoal = require('../models/setSoal')

module.exports = function (done){
    let arrOfPromise = [
        SetSoal.deleteMany({})
    ]

    Promise.all(arrOfPromise)
        .then(()=>{
            done()
        })
        .catch(err =>{
            console.log(err)
        })
}