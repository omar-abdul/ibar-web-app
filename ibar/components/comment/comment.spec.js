var app = require("../../app");
var chai = require("chai");
var request = require("supertest");
var server = request.agent(app);
var expect = chai.expect;
var user = {
    email: "ilbuuromar@gmail.com",
    password: "123456789"
  };
  var auth = {};
  beforeEach(loginUser(auth));
describe("POST /api/add-comment", function() {
  it("login", loginUser());
  it("url requires login and add comment", function(done) {
      var comment = {
        mentor: 161, stars: 4, text: "Something uselsess"
      }
    server
      .post("/api/add-comment")
      .set('Authorization',  auth.token)
      .send(comment)
      
      .expect(200)
      .end(function(err, res) {
        
        console.log(res.body);
        
        done();
      });
  });
});
describe("POST /api/add-comment", function() {
  it("login", loginUser());
  it("requires login but fails to add comment", function(done) {
      var comment = {
        mentor: 149, stars: 4, text: "Something uselsess"
      }
    server
      .post("/api/add-comment")
      .set('Authorization',  auth.token)
      .send(comment)
      
      
      .end(function(err, res) {
      
        console.log(res.body);
        expect(res.body.success).to.be.false;
        
        done();
      });
  });
});

describe("GET /api/comments", function() {
  it("get all comments for mentor", function(done) {
    request(app)
      .get("/api/comments/145")
      .end(function(err, res) {
        if (err)return  done(err);
        expect(res.body.comments).to.be.an("array");
        expect(res.body.comments).to.be.empty;
        expect(res.statusCode).to.be.equal(200);
        done();
      });
  });
});

function loginUser() {
  var user = {
    email: "ilbuuromar@gmail.com",
    password: "123456789"
  };
  return function(done) {
    server
      .post("/api/authenticate")
      .send(user)
      .end(onResponse);

      function onResponse(err, res) {

         auth.token = res.body.token;
         return done();
      }
  };
}

