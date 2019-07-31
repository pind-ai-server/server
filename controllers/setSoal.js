const Question = require('../models/setSoal')
const User = require('../models/user')
let converter = require('json-2-csv')
class ControllerSetSoal {
    static create(req, res, next) {
        let input = { ...req.body }
        let passData = ''
        Question.create(input)
            .then(data => {
                passData = data
                return User.findOneAndUpdate({ UserId: data.UserId }, { $push: { setSoal: data._id } }, { new: true })
                })
            .then(user =>{        
                // console.log('hasil push ke user ini user',user);
                res.status(201).json(passData)
            })
            .catch(next)
    }
    static findAll(req, res, next) {
        Question.find().populate('answers')
            .then(data => {
                let dataku = [{
                    subjectName : "ppkn",
                    avgScore : 60,
                    passedStudent : 3,
                    failedStudent : 22,
                    passingGrade : 65,
                    highestScore : 80,
                    lowestScore : 55,
                    questionSum : 30
                },{
                    subjectName : "penjaskes",
                    avgScore : 60,
                    passedStudent : 3,
                    failedStudent : 22,
                    passingGrade : 65,
                    highestScore : 80,
                    lowestScore : 55,
                    questionSum : 30
                },{
                    subjectName : "matematika",
                    avgScore : 60,
                    passedStudent : 3,
                    failedStudent : 22,
                    passingGrade : 65,
                    highestScore : 80,
                    lowestScore : 55,
                    questionSum : 30
                },{
                    subjectName : "bahasa indonesia",
                    avgScore : 60,
                    passedStudent : 3,
                    failedStudent : 22,
                    passingGrade : 65,
                    highestScore : 80,
                    lowestScore : 55,
                    questionSum : 30
                },{
                    subjectName : "sejarah",
                    avgScore : 60,
                    passedStudent : 3,
                    failedStudent : 22,
                    passingGrade : 65,
                    highestScore : 80,
                    lowestScore : 55,
                    questionSum : 30
                }]
                return converter.json2csvAsync(dataku,{delimiter : {wrap : false, field : ',', eol : '\n'},keys : ["subjectName","avgScore", "passedStudent", "failedStudent" , "passingGrade", "highestScore", "lowestScore", "questionSum"]} )
                // return converter.json2csvAsync(data, {delimiter : {wrap : false, field : ',', eol : '\n'} ,keys : ["_id","UserId", "title", "folderName"]})
                // var fields = Object.keys(data[0])
                // var replacer = function(key, value) { return value === null ? '' : value } 
                // var csv = data.map(function(row){
                //     return fields.map(function(fieldName){
                //       return JSON.stringify(row[fieldName], replacer)
                //     }).join(',')
                // })
                // csv.unshift(fields.join(','))
                // let a = csv.join('\r\n')
                // let filename = "okeman"
                // let uri = 'data:text/csv;charset=utf-8,' + escape(a)
                // let link = document.createElement("a")
                // link.download = filename.csv
                // link.href = uri
                // console.log(a);
            })
            .then(data=>{
                console.log(data);
                res.set({
                    'Content-Type': 'text/csv; charset=UTF-8',
                    'Content-Disposition': 'attachment; filename="file.csv"',
                 });
                // res.status(200).json(data)
                res.send('\uFEFF' + data)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Question.findOne({ _id: req.params.id }).populate('answers')
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static findUserSoal(req,res,next){
        Question.find({UserId : req.params.userId})
        .then(user =>{
            res.status(200).json(user)
        })
        .catch(next)
    }

    static update(req, res, next) {
        let input = { ...req.body }
        Question.findOneAndUpdate({ _id: req.params.id }, input, { new: true })
            .then(user => {
                res.status(200).json(user)
            })
            .catch(next)
    }

    static keyUpdate(req,res,next){
        let input = { ...req.body }
        Question.findOneAndUpdate({_id : req.params.id}, input, { new : true })
            .then(question =>{
                res.status(200).json(question)
            })
            .catch(next)
    }

    static delete(req, res, next) {
        Question.findOneAndDelete({ _id: req.params.id })
            .then(user => {
                res.status(200).json({ message: 'delete successfully' })
            })
            .catch(next)
    }
}

module.exports = ControllerSetSoal