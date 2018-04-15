const {Pool} = require("pg");
var config = require("../../config/config");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const {DatabaseError} = require("../../helper/custom-errors");

require("dotenv").config();

const pool = config;



module.exports.addRate = async function(rate){
    const client  = await pool.connect();
    const uniqueId = rate.student+"-"+rate.mentor;
    
    const query = `INSERT INTO rate (student_id,mentor_id,rate_number) VALUES ($1,$2,$3)
    ON CONFLICT(mentor_id,student_id) DO UPDATE set rate_number = $3 WHERE rate.student_id = $1 AND 
    rate.mentor_id= $2
     RETURNING id`;
    
    try{
      const rates = await client.query(query,[rate.student,rate.mentor,rate.num]);
      return rates.rows[0];
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  }
  module.exports.addComment = async function(comment){
    const client  = await pool.connect();
    
    const query = `INSERT INTO comments (student_id,mentor_id,comment_text,rate_id) VALUES ($1,$2,$3,$4)
    ON CONFLICT(rate_id) DO UPDATE set comment_text = $3 WHERE comments.student_id = $1 AND 
    comments.mentor_id= $2;`;
    
    try{
      const result = await client.query(query,[comment.student,comment.mentor,comment.text,comment.rateId]);
      
      return result;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }  
  };


  module.exports.getComments = async function (id){
    const client  = await pool.connect();
    
    const query = `SELECT comments.id,comments.created_at, comments.student_id, rate.mentor_id,
     rate.rate_number,comments.comment_text, users.name FROM comments 
    LEFT JOIN  rate ON rate.id = comments.rate_id 
    LEFT JOIN users ON  users.id = comments.student_id 
    WHERE comments.mentor_id = $1`;
    try{
      const result = await client.query(query,[id]);
      return result.rows;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };