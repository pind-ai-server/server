const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const clearSoal = require('../helpers/test')
const mongooseConnect = require("../helpers/mongooseConnect")
const { createAnswerPass } = require('../helpers/createAnswerPass')
const { createAnswerFail } = require('../helpers/createAnswerFail')
const { createAnswerNtrl } = require('../helpers/createAnswerNtrl')
const { createSetSoal } = require('../helpers/createSetSoal')
const mongoose = require('mongoose')
const { clearAllAnswer } = require('../helpers/clearAllAnswer')
const setSoal = require('../models/setSoal')

chai.use(chaiHttp)

after(function(done){
    clearSoal(done)
})
let setSoalNew = null
let answer = null

const expect = chai.expect

let soal1 = ''
describe("set soal test", function(){
    describe('POST /users', () => {

        it('should send an object of inserted user with 201 status code', function(done){
            const loginUser = {
                userName : "pakguru",
                email : "pak@mail.com",
                UserId : "1234567890",
                photoUrl: 'urlPhoto'
            }

            chai
            .request(app)
            .post('/users/login')
            .send(loginUser)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(201)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')
                expect(res.body).to.have.property('UserId')
                expect(res.body).to.have.property('email')
                expect(res.body).to.have.property('userName')
                expect(res.body).to.have.property('setSoal')
                expect(res.body.UserId).to.equal(loginUser.UserId)
                expect(res.body.email).to.equal(loginUser.email)
                expect(res.body.userName).to.equal(loginUser.userName)
                done()
            })

        })
        it('should send an object of inserted question with 201 status code', function(done){
            const newSoal = {
                UserId : "1234567890",
                title : "ujian matematika mid semester",
                folderName : "heyho"
            }

            chai
            .request(app)
            .post('/setSoal')
            .send(newSoal)
            .end(function(err,res){
                soal1 = res.body
                expect(err).to.be.null
                expect(res).to.have.status(201)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')                
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('folderName')
                expect(res.body).to.have.property('UserId')
                expect(res.body).to.have.property('answers')
                expect(res.body.title).to.equal(newSoal.title)
                expect(res.body.UserId).to.equal(newSoal.UserId)
                expect(res.body.folderName).to.equal(newSoal.folderName)
                done()
            })
        })

        

        it('should send an object error with status code 404', function(done){
            
            const newSoal = {
                UserId : "",
                title : "ujian matematika mid semester",
                folderName : "heyho"
            }

            chai
            .request(app)
            .post('/setSoal')
            .send(newSoal)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
        })

        it('should send an object error with status code 404 validation error', function(done){
            
            const newSoal = {
                title : "ujian matematika mid semester",
                folderName : "heyho"
            }

            chai
            .request(app)
            .post('/setSoal')
            .send(newSoal)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
        })

        it('should send an object error with status code 500 validation error', function(done){
            
            const newSoal = {
                userid : "1234567890",
                title : "ujian matematika mid semester",
                folderName : "heyho"
            }

            chai
            .request(app)
            .post('/setSoal')
            .send(newSoal)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(404)
                done()
            })
        })
    })

    describe('GET /setSoal', ()=>{
        it('should return an array with 200 status code', function(done){
            chai
            .request(app)
            .get('/setSoal')
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                expect(res.body[0]).to.be.an('object')
                expect(res.body[0]).to.have.property('_id')                
                expect(res.body[0]).to.have.property('title')
                expect(res.body[0]).to.have.property('folderName')
                expect(res.body[0]).to.have.property('UserId')
                expect(res.body[0]).to.have.property('answers')
                done()
            })
        })

        it('should return an object with id in reqparams id  with 200 status code', function(done){
            chai
            .request(app)
            .get(`/setSoal/${soal1._id}`)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')                
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('folderName')
                expect(res.body).to.have.property('UserId')
                expect(res.body).to.have.property('answers')
                done()
            })
        })

        it('should return an array with UserId in req params  with 200 status code', function(done){
            chai
            .request(app)
            .get(`/setSoal/${soal1.UserId}/users`)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('array')
                done()
            })
        })
    })

    describe('PUT /setSoal',() =>{
        it('should return an object with updated value', function(done){
            const updateData = {
                title : "ujian Matematika kelas 12 mid semester"
            }
            chai
            .request(app)
            .put(`/setSoal/${soal1._id}`)
            .send(updateData)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')                
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('folderName')
                expect(res.body).to.have.property('UserId')
                expect(res.body).to.have.property('answers')
                expect(res.body.title).to.equal(updateData.title)
                done()
            })
        })

        it('should return an object with updated value', function(done){
            const updateData = {
                answerKey : {
                    "1" : "A",
                    "2" : "B",
                    "3" : "C"
                }
            }
            chai
            .request(app)
            .put(`/setSoal/${soal1._id}/keyUpdate`)
            .send(updateData)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('_id')                
                expect(res.body).to.have.property('title')
                expect(res.body).to.have.property('folderName')
                expect(res.body).to.have.property('UserId')
                expect(res.body).to.have.property('answers')
                expect(res.body).to.have.property('answerKey')
                expect(res.body.answerKey["A"]).to.equal(updateData.answerKey["A"])
                done()
            })
        })
    })
    
    describe('Error Mongoose', ()=>{
        it('should return an object error with message of Mongo error', function(done){
            mongooseConnect("xxx",mongoose)
            .then(result =>{
                expect(result).to.equal(false)
                done()
            })
            .catch(err=>[
                done(err)
            ])
        })
    })

    describe('Delete /setSoal', ()=>{
        it("should return an object with message of success delete", function(done){
            chai
            .request(app)
            .delete(`/setSoal/${soal1._id}`)
            .end(function(err,res){
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.be.equal('delete successfully')
                done()
            })
        })
    })
    describe ('GET /setSoal/:userId/csv', () => {
        let setSoalNew2
        before ( async function () {
            await clearAllAnswer()
            await clearSoal()
            setSoalNew2 = await createSetSoal()
            answerPass = await createAnswerPass(setSoalNew2._id)
            answerNtrl = await createAnswerNtrl(setSoalNew2._id)
            answerFail = await createAnswerFail(setSoalNew2._id)
            await setSoal.findOneAndUpdate({
                _id: setSoalNew2._id
            }, {
                $push : {
                    answers: [answerFail._id, answerPass._id, answerNtrl._id],
                }
            }, { new : true })
        })
        it('should return an object with 200 status code (get generate CSV Failed)', function(done) {
            chai
                .request(app)
                .get(`/setSoal/${setSoalNew2.UserId}/csv`)
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res.headers).to.be.a('object')
                    expect(res.headers).to.have.property('content-type')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
        it('should return an object with 400 status code (get generate CSV Failed)', function(done) {
            chai
                .request(app)
                .get(`/setSoal/23819208/csv`)
                .then(function(res) {
                    expect(res).to.have.status(404)
                    expect(res.headers).to.be.a('object')
                    expect(res.headers).to.have.property('message')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
    })
    
})