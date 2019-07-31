const setSoal = require('../models/setSoal')
const User = require('../models/user')
/* istanbul ignore file */
module.exports = {
    createSetSoal () {
        if(process.env.NODE_ENV === 'test') {
            let setSoalDataFake = {
                title: 'Ujian Akhir Sekolah Kelas 10',
                folderName: 'Matematika',
                answerKey: {},
                answers: [],
                UserId: '1'
            }
            let passData
            return setSoal
                .create(setSoalDataFake)
                .then((data) => {
                    passData = data
                    return User.create({
                        userName: 'bilal Guru',
                        UserId: '1',
                        email: 'bilalGuru@mail.com',
                        photoUrl: 'urlPhoto'
                    })
                })
                .then(() => {
                    return User.findOneAndUpdate({ UserId: passData.UserId }, { $push: { setSoal: passData._id } }, { new: true })
                })
                .then(() => {
                    return passData
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }
}