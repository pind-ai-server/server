const SetSoal = require('../models/setSoal')
/* istanbul ignore file */
module.exports = function (done){
    let arrOfPromise = [
        SetSoal.deleteMany({})
    ]
    Promise.all(arrOfPromise)
        .then(()=>{
            console.log('hapus semua set Soal')
            done()
        })
        .catch(err =>{
            console.log(err)
        })
}