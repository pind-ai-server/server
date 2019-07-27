const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../app')
const { clearAllUser } = require('../helpers/clearAllUser')

chai.use(chaiHttp);
const expect = chai.expect

before (  function (done) {
     clearAllUser(done)
})

describe('User CRUD' , function () {
    let userId
    describe ('POST /login', function () {
        it('should return an object with 201 status code (User login for the first time)', function(done) {
            let user = {
                email : 'bilal@mail.com',
                userName : 'Bilal',
                UserId: '1'
            }
            chai
                .request(app)
                .post('/users/login')
                .send(user)
                .then(function(res) {
                    userId = res.body._id
                    expect(res).to.have.status(201)
                    expect(res.body).to.be.a('object')
                    expect(res.body).to.have.property('_id')
                    expect(res.body).to.have.property('email')
                    expect(res.body).to.have.property('userName')
                    done()
                })
                .catch(err => {
                    console.log(err)
                    done()
                })
            })
            it('should return an object with 200 status code (user update new setSoal)', function(done) {
                let user = {
                    email : 'bilal@mail.com',
                    userName : 'Bilal',
                    UserId: '1'
                }
                chai
                    .request(app)
                    .put(`/users/${userId}`)
                    .send(user)
                    .then(function(res) {
                        // console.log('ini hasil testing')
                        // console.log('-=-=-=-=-=-=--=',res.body, '-=-==---=-=--==-=--=')
                        expect(res).to.have.status(200)
                        expect(res.body).to.be.a('object')
                        expect(res.body).to.have.property('_id')
                        expect(res.body).to.have.property('email')
                        expect(res.body).to.have.property('userName')
                        done()
                    })
                    .catch(err => {
                        console.log(err)
                        done()
                    })
            })
    })
})