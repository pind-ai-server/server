const setSoal = require('../models/setSoal')
const User = require('../models/user')
/* istanbul ignore file */
module.exports = {
    createSetSoalPass () {
        if(process.env.NODE_ENV === 'test') {
            let setSoalDataFake = {
                title: 'Ujian Akhir Sekolah Kelas 10',
                folderName: 'Matematika',
                answerKey: {
                    '1': 'A',
                    '2': 'A',
                    '3': 'E',
                    '4': 'A',
                    '5': 'B',

                },
                passingGrade: 10,
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
                })
        }
    }
}