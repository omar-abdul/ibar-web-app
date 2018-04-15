'use strict'

var chai = require('chai');
var request = require('supertest');
var app = require('../../app');
var expect = chai.expect;

describe('Token api ',function(){
    var email = {
        email:'ilbuuromar@gmail.com'
    };
   describe('#Confirmation api',function(){
       it('should fail to confimation email',function(done){
           request(app).get('/api/confirmation/1234')
           .end(function(err, res){
               expect(res.statusCode).to.equal(404);
               expect(res.body.success).to.be.false;
               done();
           });
       });

   });
   describe('#Resend Token',function(){
       it('should resend token',function(done){
           request(app).post('/api/resend-token')
           .send(email)
           .end(function(err,res){
               expect(res.body.success).to.be.true;
               expect(res.statusCode).to.equal(200);
               done();
           });
       });
   });

});
