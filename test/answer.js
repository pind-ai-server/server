const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../app')
const { clearAllAnswer } = require('../helpers/clearAllAnswer')
const { clearAllUser } = require('../helpers/clearAllUser')
const { createSetSoal } = require('../helpers/createSetSoal')

chai.use(chaiHttp);
const expect = chai.expect
let setSoal = null
let answer = null
before ( async function () {
    await clearAllAnswer()
    setSoal = await createSetSoal()
})
after (async function () {
    await clearAllUser()
})

describe('Answer CRUD' , () => {
    describe ('POST /answers/', () => {
        it('should return an object with 201 status code (new answer create)', function(done) {
            let answerDataFake = {
                name : 'bilal@mail.com',
                score : '90',
                answers: {
                    "1": "A"
                },
                setSoalId: setSoal._id
            }
            chai
                .request(app)
                .post('/answers')
                .send(answerDataFake)
                .then(function(res) {
                    answer = res.body
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
                .get(`/answers/${answer._id}`)
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
            score : '10',
        }
        it('should return an object with 200 status code (answer updated)', function(done) {
            chai
                .request(app)
                .put(`/answers/${answer._id}`)
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
    describe ('DELETE /answers/:id', () => {
        it('should return an object with 200 status code (answer deleted)', function(done) {
            chai
                .request(app)
                .delete(`/answers/${answer._id}`)
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
    })
})