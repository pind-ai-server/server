const Answer = require('../models/answer')
const axios = require('axios')
const extractAnswer = require('../helpers/extractAnswer')
const extractName = require('../helpers/extractName')
const setSoal = require('../models/setSoal')
let converter = require('json-2-csv')

class ControllerAnswer {
    static create(req, res, next) {
        console.log('masuk tembak azure')
        // console.log('req.file =======',req.file)
        const url = req.file.cloudStoragePublicUrl
        const headers = {
            "Content-Type": "application/json",
            "Ocp-Apim-Subscription-Key": process.env.AZURE_KEY
        }
        axios({
            url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/read/core/asyncBatchAnalyze',
            method: 'POST',
            headers: headers,
            data: {
                "url": url
            }
        })
        .then((data) => {
            setTimeout(() => {
                axios({
                    url: data.headers['operation-location'],
                    method: 'GET',
                    headers: headers
                })
                    .then((result) => {
                        console.log('ini result.data', result.data)
                        if (result.data.recognitionResults) {
                            console.log('masuk create answer server')
                            const answers = extractAnswer(result.data)
                            const name = extractName(result.data)
                            console.log('name', name)
                            console.log('answers', answers)
                            console.log('req.body =======',req.body.setSoalId)
                            if (name.status === 'success' && answers.status === 'success') {
                                let newAnswer = new Answer({
                                    name: name.data,
                                    answers: answers.data,
                                    setSoalId: req.body.setSoalId,
                                    imageUrl: req.file.cloudStoragePublicUrl    
                                })
                                return newAnswer.save()
                                    .then(async answer => {
                                        await setSoal.findOneAndUpdate({_id: answer.setSoalId}, { $push : { answers: answer._id} })
                                        return answer
                                    })
                                    .then(answer => {
                                        res.status(201).json({
                                            status: 'success',
                                            data: answer
                                        })
                                    })
                                    .catch(next)
                                // Answer.create(req.body)
                                //     .then(data => {
                                //         return setSoal.findOneAndUpdate({_id: data.setSoalId}, { $push : { answers: data._id} })
                                //     })
                                //     .then(data => {
                                //     res.status(201).json(data)
                                //     })
                                //     .catch(next)
                            } else {
                                throw {
                                    status: 'error',
                                    data: 'take another photo'
                                }
                            }
                            
                        } else {
                            throw {
                                status: 'error',
                                data: 'take another photo'
                            }
                        }
                    })
                    .catch(err => {
                        console.log('ini err', err)
                        res.json({
                            status: 'error',
                            data: 'take another photo'
                        })
                    })
            }, 10000)
        })
        .catch(err => {
            console.log('ini err', err)
            res.json({
                status: 'error',
                data: 'take another photo'
            })
        })
        
    }
    static findAll(req, res, next) {
        Answer.find({}).populate('setSoalId')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }

    static generateCSV(req,res,next){
        Answer.find({setSoalId : req.params.setSoalId}).populate('setSoalId')
            .then(data => {
                console.log(data);
                let arrayData = []
                data.forEach(el =>{
                    let student = {}
                    student.studentName = el.name
                    student.score = el.score
                    if(el.score >= el.setSoalId.passingGrade){
                        student.status = "passing"
                    }else{
                        student.status = "failed"
                    }
                    student.subjectName = el.setSoalId.title
                    console.log('iki student booos', student);
                    arrayData.push(student)
                })
                return converter.json2csvAsync(arrayData,{delimiter : {wrap : false, field : ',', eol : '\n'},keys : ["subjectName","studentName", "score", "status"]} )
                // res.status(200).json(data)
            })
            .then(data =>{
                console.log(data);
                    res.set({
                        'Content-Type': 'text/csv; charset=UTF-8',
                        'Content-Disposition': 'attachment; filename="file.csv"',
                     });
                    res.send('\uFEFF' + data)
            })
            .catch(next)
    }
    static findOne(req, res, next) {
        Answer.findOne({ _id: req.params.id }).populate('setSoalId')
            .then(data => {
                res.status(200).json(data)
            })
            .catch(next)
    }
    static update(req, res, next) {
        console.log('masuk edit answer client')
        console.log(req.body)
        console.log(req.params.id)
        // let input = { ...req.body }
        Answer.findOne({ _id: req.params.id })
            .then(data => {
                console.log(data)
                let option = {}
                req.body.name && (option.name = req.body.name)
                req.body.answers && (option.answers = req.body.answers)
                req.body.setSoalId && (option.setSoalId = req.body.setSoalId)
                req.body.imageUrl && (option.imageUrl = req.body.imageUrl)
                data.set(option)
                return data.save()
            })
            .then(data => {
                console.log('hasil save', data)
                console.log('success edit')
                res.status(200).json(data)
            })
            .catch(next)
    }
    static delete(req, res, next) {
        Answer.findOneAndDelete({ _id: req.params.id })
            .then(data => {
                res.status(200).json({ message: 'delete successfully' })
            })
            .catch(next)
    }
}

module.exports = ControllerAnswer