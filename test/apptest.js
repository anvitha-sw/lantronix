let chai = require('chai');
let chaiHttp = require('chai-http');
var should = chai.should();
chai.use(chaiHttp);
let server = require('../app');

describe('Userregister', () => {
    describe('/user/register', () => {
        it('it should post the user details to database', (done) => {

            let user = {
                username: 'thanos',
                firstname: 'welcome',
                lastname: 'hello',
                email: 'hello@gmail.com',
                password: '12345'
            }

            chai.request(server)
                .post('/user/register')
                .send(user)
                .end((err, res) => {
                    (res).should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                });
        });
    });

    describe('/user/login', () => {
        it('it should fetch the user details from the database', (done) => {

            let user = {
                username: 'thanos',
                password: '12345'
            }

            chai.request(server)
                .post('/user/login')
                .send(user)
                .end((err, res) => {
                    (res).should.have.status(200);
                    done();
                });
        });
    });
});