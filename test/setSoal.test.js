const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const clearSoal = require('../helpers/test')

chai.use(chaiHttp)

// before(function(done){
//     clearSoal(done)
// })

// after(function(done){
//     clearSoal(done)
// })

const expect = chai.expect

let soal1 = ''

describe("set soal test", function(){
    describe('POST /users', () => {

        it('should send an object of inserted user with 201 status code', function(done){
            const loginUser = {
                userName : "pakguru",
                email : "pak@mail.com",
                UserId : "1234567890",
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
    })

    describe('GET /setSoal', ()=>{
        it('should return an array with 200 status code', function(done){
            chai
            .request(app)
            .get('/setSoal')
            .end(function(err,res){
                // console.log('response======>', res.body[0]);
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
                console.log('response======>', res.body);
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
                // console.log('response update2 ======>', res.body);
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

    describe('Delete /setSoal', ()=>{
        it("should return an object with message of success delete", function(done){
            chai
            .request(app)
            .delete(`/setSoal/${soal1._id}`)
            .end(function(err,res){
                console.log("response======>", res.body);
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.be.an('object')
                expect(res.body).to.have.property('message')
                expect(res.body.message).to.be.equal('delete successfully')

                done()
            })
        })
    })
    
    
})