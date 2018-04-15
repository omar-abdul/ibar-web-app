'use strict';

var app = require('../../app');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;
var server = request.agent(app);

var m_auth={};
var s_auth={};

describe("#POST  job",function(){

var job = {
    id:161
}
    before(loginStudent(s_auth))
    it("should add a new job",function(done){
        request(app)
        .post("/api/hire")
        .set("Authorization",s_auth.token)
        .send(job)
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.true;
            console.log(request.body)
            done();
        })

    })
    before(loginMentor(m_auth))
    it("should not add job :user not students",function(done){
        request(app)
        .post("/api/hire")
        .set("Authorization",m_auth.token)
        .send(job)
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.false;
            done();
        })

    })
    it("should not add job : not authorized",function(done){
        request(app)
        .post("/api/hire")
        .send(job)
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(401);
            expect(res.body.success).to.be.undefined;
            done();
        })
    })
})

describe("#GET jobs",function(){
    before(loginMentor(m_auth))
    it("should return job for mentor",function(done){
        request(app)
        .get("/api/history")
        .set("Authorization",m_auth.token)
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.job).to.be.an('array');
            expect(res.body.job).to.not.be.empty;
            done();
        })

    })
    before(loginStudent(s_auth))
    it("should return job for student",function(done){
        request(app)
        .get("/api/history")
        .set("Authorization",s_auth.token)
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body.job).to.be.an('array');
            expect(res.body.job).to.not.be.empty;
            done();
        })
    })

    it("should not return job: not authorized",function(done){
        request(app)
        .get("/api/history")
        .end(function(err,res){
             
            expect(res.statusCode).to.be.equal(401);
            expect(res.body.success).to.be.undefined;
            done();
        })

    })
})


function loginMentor() {
    var user={
        email:"ilbuuromr@gmail.com",
        password:"123456789"
    }
    return function(done) {
        server
            .post('/api/authenticate')
            .send(user)
            .end(onResponse);

        function onResponse(err, res) {
           
           m_auth.token = res.body.token;
           return done();
        }
    };
};
function loginStudent(){
    var user={
        email:"ilbuuromar@gmail.com",
        password:"123456789"
    }
    return function(done) {
        server
            .post('/api/authenticate')
            .send(user)
            .end(onResponse);

        function onResponse(err, res) {
            
            s_auth.token = res.body.token;
            return done();
        }
    };
};