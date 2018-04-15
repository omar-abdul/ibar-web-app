var chai = require('chai');
var app = require('../../app');
var request = require('supertest');
var server = request(app);
var expect = chai.expect;
var user = {
    email: "ilbuuromar@gmail.com",
    password: "123456789"
  };
 
  var token={};
  var auth = {};
  var st_auth={};
  describe("#POST register api",function(){
      var student={
          name:"omar",
          email:"ilbuuromar@gmail.com",
          phoneNumber:"0634488908",
          password:"123456789",
          role:"students"
      }
      var mentor={
        name:"omar",
        email:"ilbuuromr@gmail.com",
        phoneNumber:"0634488909",
        password:"123456789",
        role:"mentors"
    }
      it("should register user as student",function(done){
          request(app)
          .post("/api/register")
          .send(student)
          .end(function(err,res){
              expect(res.statusCode).to.be.equal(200)
              expect(res.body.success).to.be.true;
              done();
          })
      })
      it("should register user as mentor ",function(done){
        request(app)
        .post("/api/register")
        .send(mentor)
        .end(function(err,res){
            expect(res.statusCode).to.be.equal(200)
            expect(res.body.success).to.be.true;
            done();
        })
          
    })
    it("should fail to register user due to duplicate ",function(done){
        request(app)
        .post("/api/register")
        .send(mentor)
        .end(function(err,res){
            expect(res.statusCode).to.be.equal(200)
            expect(res.body.success).to.be.false;
            done()
        })
          
    })
  })

describe("#POST login api",function(){
    var user ={
        email:"ilbuuromar@gmail.com",
        password:"123"
    }
    var fakeuser ={
        email:"ilbuomar@gmail.com",
        password:"123"
    }
    it('should login user',loginUser());

    it("should not login incorrect password",function(done){
        
        request(app)
        .post("/api/authenticate")
        .send(user)
        .end(function(err, res){
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.false;
            expect(res.body).to.have.deep.property("msg","Email and passowrd are incorrect")
            done()
        })
    })
    it("should not login user doesnt exist",function(done){
        
        request(app)
        .post("/api/authenticate")
        .send(fakeuser)
        .end(function(err,res){
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.false;
            expect(res.body).to.have.deep.property("msg","No user is associated with this email")
            done()
        })
    })

})
describe("#POST student login api",function(){
    it('should login user',loginStudent());

})
describe("#GET get user profile",function(){
    
    
    before(loginUser(auth));
    it("should get user profile",function(done){
        request(app).get("/api/profile")
        .set('Authorization', auth.token)
        .end(function(err,res){
            
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.user).to.not.be.null;
            
            done();

        })
    })
});

describe("#POST password api",function(){
    var tk={};
    var user={
        email:"ilbuuromar@gmail.com"
    }
    describe("Create password token",function(){
        it("should create token ",function(done){
            request(app)
            .post("/api/forgot-password")
            .send(user)
            .end(function(err, res){
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.be.true;
                tk.token = res.body.token;
                done();
            })
        })
    });
    describe("Confirm password",function(){
        it("should confrim existence of token",function(done){
            request(app)
            .post("/api/account/password-reset")
            .send(tk)
            .end(function(err, res){
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.be.true;
                done();
                
            })
        })
    })
    describe("Update password",function(){
        var password={
            password:"123456789"
        }
        before(loginUser(auth));
        it("should update password ",function(done){
            request(app)
            .post("/api/update-password")
            .set("Authorization",auth.token)
            .send(password)
            .end(function(err, res){
                
                expect(res.statusCode).to.equal(200);
                expect(res.body.success).to.be.true;
                tk.token = res.body.token;
                done();
            })
        })
    })

    describe("Update password",function(){
        var password={
            password:"123456789"
        }
        before(loginUser(auth));
        it("should not update password ",function(done){
            request(app)
            .post("/api/update-password")
            .send(password)
            .end(function(err, res){
               
                expect(res.statusCode).to.equal(401);
                expect(res.body.success).to.be.undefined;
                done();
            })
        })
    })
    
          
});
describe("#get Subjects",function(){
    it("should get all subjects",function(done){
        request(app).get("/api/subjects")
        .end(function(err,res){
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.have.property("subjects");
            expect(res.body.subjects).to.be.an("array");
            console.log(res.body);
            done();
        })
    })
})
describe("#POST upload image",function(){
    
    before(loginUser(auth));
    it("should upload file",function(done){
        request(app)
        .put("/api/update/image")
        .set("Authorization",auth.token)
        .attach("image","../ibar/public/assets/images/typing.jpg")
        .end(function(err,res){
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.true;
            expect(res.body).to.have.property('url');
            done();
        })
    })
    it("should not upload file",function(done){
        request(app)
        .put("/api/update/image")
        .attach("image",'../ibar/public/assets/images/logo.png')
        .end(function(err,res){   
         console.log(res.body);
            expect(res.statusCode).to.be.equal(401);
            done();
        })
    })
})

describe("#POST update user",function(){
    var lng = 44.0770133999999;
    var lat = 9.562389;
    before(loginUser(auth))
    it("should update user",function(done){
        request(app)
        .put("/api/update")
        .set("Authorization",auth.token)
        .send({phoneNumber:'0633388908',subjects:["English"],location:{latitude:lat,longtitude:lng}})
        .end(function(err,res){
 
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.true;
            done();
        })

    })

    it("should not update user duplicate phone",function(done){
        request(app)
        .put("/api/update")
        .set("Authorization",auth.token)
        .send({phoneNumber:'0634488908',subjects:["English"],location:{latitude:lat,longtitude:lng}})
        .end(function(err,res){
    
            expect(res.statusCode).to.be.equal(200);
            expect(res.body.success).to.be.false;
            done();
        })

    })
})





function loginStudent(){
    var user={
        email:"ilbuur@gmail.com",
        password:"123456789"
    }
    return function(done) {
        server
            .post('/api/authenticate-student')
            .send(user)
            .end(onResponse);

        function onResponse(err, res) {
           
            st_auth.token = res.body.token;
            return done();
        }
    };
};


function loginUser() {
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
          
           auth.token = res.body.token;
           return done();
        }
    };
};
