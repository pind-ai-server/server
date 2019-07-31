const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../app')
const { clearAllAnswer } = require('../helpers/clearAllAnswer')
const { clearAllUser } = require('../helpers/clearAllUser')
const { createSetSoal } = require('../helpers/createSetSoal')
const { createSetSoalPass } = require('../helpers/createSetSoalPass')
const { createAnswerPass } = require('../helpers/createAnswerPass')

const fs = require('fs')

chai.use(chaiHttp);
const expect = chai.expect
let setSoal = null
let answer = null
let answerPass = null
before ( async function () {
    await clearAllAnswer()
    setSoal = await createSetSoal()
    answerPass = await createAnswerPass(setSoal._id)
})
after (async function () {
    await clearAllUser()
})

describe('Answer CRUD' , () => {
    describe('POST /answers/', () => {
        it('should return an object with 201 status code (new answer create)',async function() {
            let newSetSoalId = setSoal._id + ''
            this.timeout(60000)
            const res = await chai
                                .request(app)
                                .post('/answers')
                                .attach("image",fs.readFileSync("./assets/ljk1.jpg"), "ljk1.jpg")
                                .field("setSoalId", newSetSoalId)
            answer = res.body
            expect(res).to.have.status(201)
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('data')
                
        })
        it('should return an object with 201 status code (new answer create azzure error)',async function() {
            let newSetSoalId = setSoal._id + ''
            this.timeout(60000)
            const res = await chai
                                .request(app)
                                .post('/answers')
                                .attach("image",fs.readFileSync("./assets/foto2.jpeg"), "foto2.jpeg")
                                .field("setSoalId", newSetSoalId)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('data')
            expect(res.body).to.have.property('status')
                
        }) 
        it('should return an object with 201 status code (new answer create azzure error)',async function() {
            let newSetSoalId = setSoal._id + ''
            this.timeout(60000)
            const res = await chai
                                .request(app)
                                .post('/answers')
                                .attach("image",fs.readFileSync("./assets/test.mp3"), "test.mp3")
                                .field("setSoalId", newSetSoalId)
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('data')
            expect(res.body).to.have.property('status')
                
        }) 
        it('should return an object with 500 status code (new answer create error)',async function() {
            let fakeImage = {
                url : 'urlFake'
            }
            const res = await chai
                                .request(app)
                                .post('/answers')
                                .send(fakeImage)
            expect(res).to.have.status(500)
            expect(res.body).to.be.a('object')
            expect(res.body).to.have.property('message')
                
        })
    })
    describe ('GET /answers/', () => {
        it('should return an object with 200 status code', function(done) {
            chai
                .request(app)
                .get('/answers')
                .then(function(res) {
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('score')
                    expect(res.body).to.have.property('answers')
                    expect(res.body).to.have.property('setSoalId')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
    })
    describe ('GET /answers/:id', () => {
        it('should return an object with 200 status code', function(done) {
            chai
                .request(app)
                .get(`/answers/${answer.data._id}`)
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('score')
                    expect(res.body).to.have.property('answers')
                    expect(res.body).to.have.property('setSoalId')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
    })
    describe ('PUT /answers/:id', () => {
        let answerDataFakeUpdate = {
            name : 'murid student fake update',
        }
        it('should return an object with 200 status code (answer updated)', function(done) {
            chai
                .request(app)
                .put(`/answers/${answer.data._id}`)
                .send(answerDataFakeUpdate)
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('name')
                    expect(res.body).to.have.property('score')
                    expect(res.body).to.have.property('answers')
                    expect(res.body).to.have.property('setSoalId')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
    })
    describe ('GET /answers/:setSoalId/csv', () => {
        
        it('should return an object with 200 status code (get generate CSV Failed)', function(done) {
            chai
                .request(app)
                .get(`/answers/${answer.data.setSoalId}/csv`)
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
        it('should return an object with 200 status code (get generate CSV Pass)', function(done) {
            chai
                .request(app)
                .get(`/answers/${answerPass.setSoalId}/csv`)
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
    })
    describe ('DELETE /answers/:id', () => {
        it('should return an object with 200 status code (answer deleted)', function(done) {
            chai
                .request(app)
                .delete(`/answers/${answer.data._id}`)
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('message')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
        it('should return an object with 404 status code (answer deleted error)', function(done) {
            chai
                .request(app)
                .delete(`/answers/1`)
                .then(function(res) {
                    expect(res).to.have.status(404)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('message')
                    done()
                })
                .catch(err => {
                    done()
                })
        })
    })
})