const SetSoal = require('../models/setSoal')
/* istanbul ignore file */
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