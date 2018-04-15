const {Pool} = require("pg");
var config = require("../../config/config");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const {DatabaseError} = require("../../helper/custom-errors");

require("dotenv").config();

const pool = config;


module.exports.getToken = async function(token){
    const client = await pool.connect();
    const query = " SELECT * FROM token WHERE token = $1";
    try{
      const result = await client.query(query,[token]);
      return result.rows[0];
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  }
  module.exports.getPassToken = async function(token){
    const client  = await pool.connect();
    const query = 'SELECT * FROM users WHERE password_reset_token = $1';
    try{
      const result= await client.query(query,[token]);
      return result.rows[0];
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };
  
  module.exports.addToken = async function(id,token){
    const client = await pool.connect();
    const query =`INSERT INTO token (user_id,token) values($1,$2) on conflict (user_id)
    do update set token=$2 WHERE token.user_id = $1;`
    try {
      const res = await client.query(query,[id,token]);
      return token;
  
  
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };

  module.exports.deleteToken = async function(id){
    const client = await pool.connect();
    const query = " DELETE FROM token  WHERE user_id = $1";
    try{
      const result = await client.query(query,[id]);
      return id;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };

  module.exports.addPasswordToken = async function(email,token){
    const client  = await pool.connect();
    const query = 'UPDATE users SET password_reset_token = $1 WHERE email = $2 RETURNING password_reset_token';
    try{
      const update = await client.query(query,[token,email]);
      return update;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };

 