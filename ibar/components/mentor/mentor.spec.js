'use strict';

var app = require('../../app');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;


describe("#Mentor api endpoint test",function(){
   var lng = 44.0770133999999;
   var lat = 9.562389;
   var subject = 'English';
   var subject2 = 'Math';
   var subject3 = 'Science';
   describe("Nearby Mentors",function(){
    describe('#Close by mentor test without subject',function(){
        it("should return an array of mentors",function(done){
            request(app).get(`/api/find-mentors?lng=${lng}&lat=${lat}`)
            .end(function(err,res){
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.res).to.be.an('array');
                done();

            });

        });
    });
    describe('##Close by mentor test with subject',function(){
        it("should return an array of mentors",function(done){
            request(app).get(`/api/find-mentors?lng=${lng}&lat=${lat}&subject=${subject}`)
            .end(function(err,res){
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.res).to.be.an('array');
                done();

            });

        });
    });
    describe('###Close by mentor test with subject',function(){
        it("should return an array of mentors",function(done){
            request(app).get(`/api/find-mentors?lng=${lng}&lat=${lat}&subject=${subject2}`)
            .end(function(err,res){
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.res).to.be.an('array');
                done();

            });

        });
    });
    describe('####Close by mentor test with subject',function(){
        it("should return an empty array",function(done){
            request(app).get(`/api/find-mentors?lng=${lng}&lat=${lat}&subject=${subject3}`)
            .end(function(err,res){
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.res).to.be.an('array');
                expect(res.body.res).to.be.empty;
                done();

            });

        });
    });

   })

   describe("Get single mentor ",function(){
       var id = 150;
       var id2 = 142;
       describe("#Get mentor by id",function(){
           
           it("should return single mentor",function(done){
               request(app).get(`/api/mentor/${id}`)
               .end(function(err,res){
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.success).to.be.true;
                expect(res.body.user).to.be.an('object');

                expect(res.body.user).to.have.deep.property('name','Omar');
                done();
               })
           })
       })
       describe("#Get mentor by id",function(){
        it("should not return  mentor",function(done){
            request(app).get(`/api/mentor/${id2}`)
            .end(function(err,res){
             expect(res.statusCode).to.be.equal(200);
             expect(res.body.success).to.be.false;
             expect(res.body.user).to.be.undefined;
             expect(res.body.user).to.be.not.null;

             done();
            })
        })
    })
   })
   

});



