const {Pool} = require("pg");
var config = require("../../config/config");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const {DatabaseError} = require("../../helper/custom-errors");

require("dotenv").config();

const pool = config;



module.exports.addJob = async function (userIds){
    const client = await pool.connect();
    const query =`INSERT INTO jobs(mentor_id,student_id,student_paid,paid_to_teacher) 
    VALUES($1,$2,$3,$4)`;
  
    try {
      const res = await client.query(query,
        [ userIds.mentor_id,
          userIds.student_id,
          false,
          false
        ]);
        return res ;
  
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  
  }
  module.exports.getJobByUserId = async function (user){
    const client = await pool.connect();
    let id;
    if(user.role==='mentors'){
      id = 'mentor_id';
    }else {
      id = 'student_id';
    }
    const query = `SELECT * FROM getJobHistory($1)`;
    try{

      const results = await client.query(query,[user.id]);
      return results.rows;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };
  