const Question = require('../models/setSoal')
const User = require('../models/user')
let converter = require('json-2-csv')
class ControllerSetSoal {
    static create(req, res, next) {
        console.log('ini req body create', req.body);
        
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
        Question.find().populate("answers")
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static generateCSV(req,res,next){
        Question.find({UserId : req.params.userId}).populate("answers")
            .then(data => {
                let arrayData = []
                data.forEach(el =>{
                    // console.log(el);
                    let subject = {}
                    subject.subjectTitle = el.title
                    let total = 0
                    let passing = 0
                    let failed = 0
                    let highest = el.answers[0].score;
                    let lowest = el.answers[0].score;
                    subject.passingGrade = el.passingGrade
                    el.answers.forEach(element =>{
                        total += element.score
                        if(element.score >= el.passingGrade){
                            passing+= 1
                        }else{
                            failed += 1
                        }
                        if(element.score > highest){
                            highest = element.score
                        }
                        if(element.score < lowest){
                            lowest = element.score
                        }
                    })

                    subject.avgScore = total/el.answers.length
                    subject.passedStudent = passing
                    subject.failedStudent = failed
                    subject.lowestScore = lowest
                    subject.highestScore = highest
                    let sumQuestion = 0
                    for(var key in el.answerKey){
                        sumQuestion += 1
                    }
                    subject.questionSum = sumQuestion
                    console.log('ikii subject ==>', subject);
                    arrayData.push(subject)
                })
                return converter.json2csvAsync(arrayData,{delimiter : {wrap : false, field : ',', eol : '\n'},keys : ["subjectTitle","avgScore", "passedStudent", "failedStudent" , "passingGrade", "highestScore", "lowestScore", "questionSum"]} )

            })
            .then(data=>{
                    console.log(data);
                    res.set({
                        'Content-Type': 'text/csv; charset=UTF-8',
                        'Content-Disposition': 'attachment; filename="summary.csv"',
                     });
                    res.send('\uFEFF' + data)
                })
            .catch(err =>{
                console.log(err);
            })
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