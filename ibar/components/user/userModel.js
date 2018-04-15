/*
*
*
Query the  database
*
*
*/

const {Pool} = require("pg");
var config = require("../../config/config");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const {DatabaseError} = require("../../helper/custom-errors");

require("dotenv").config();

const pool = config;

function genSalt() {
  throw new Promise(resolve => {
    bcrypt.genSalt(10, (err, salt) => resolve(salt));
  });
}

async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hashed = await bcrypt.hash(password, salt);
  return hashed;

}

module.exports.addUser = async function (user) {
  let password = await hashPassword(user.password);

  const client = await pool.connect()
  const query = `INSERT INTO users(name,password,email,phone_number,role,is_verified)
   values ($1,$2,$3,$4,$5,$6) RETURNING id`;
  const query2= 'INSERT  INTO mentors(user_id,) VALUES ($1) ;'
  try {
    const results = await client.query(query, [
      user.name,
      password,
      user.email,
      user.phoneNumber,
      user.role,
      false,
    ]);

     return results.rows[0];


  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
  


};


module.exports.getUserById = async function (id) {


  const query = `SELECT * FROM users WHERE id = $1 `;

  const client = await pool.connect();
  try {
    const result = await client.query(query, [id]);
    return result.rows[0];
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }



};
module.exports.getUserByEmail = async function (email) {
  const query =
    'SELECT * FROM users WHERE email = $1';
  const client = await pool.connect();
  try {
    const results = await client.query(query, [email]);
    return results.rows[0];

  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};

module.exports.getVerifiedUser = async function (email) {
  const query ="SELECT * FROM users WHERE email = $1 AND is_verified =$2";
  const client = await pool.connect();
  try {
    const results = await client.query(query,[email, true]);
    return results.rows[0];
  } catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }

};
module.exports.getUserByEmailOrNumber = async function(email,phone_number){
  const query = "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1  OR phone_number =$2);";
  const client = await pool.connect();
  try {
    const result = await client.query(query, [email,phone_number]);
    return result.rows[0];

  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};
//Check whether another user exists with same number
module.exports.getExistingUserByNumber = async function(phone_number,email){
  const query = "SELECT EXISTS(SELECT 1 FROM users WHERE phone_number =$1 AND email !=$2);";
  const client = await pool.connect();
  try {
    const result = await client.query(query, [phone_number,email]);
    return result.rows[0];

  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};

module.exports.comparePassword = async function (txtPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(txtPassword, hashedPassword);
  return isMatch;

};
module.exports.getUserVerificationStatus = async function (id){
  const client = await pool.connect();
  const query = " SELECT is_verified FROM users WHERE id = $1";
  try{
    const result = await client.query(query,[id]);
    return result.rows[0].is_verified;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};
module.exports.updateVerificationStatus = async function (id){
  const client = await pool.connect();
  const query = " UPDATE users SET is_verified  = $1 WHERE id = $2;";
  try{
    const result = await client.query(query,[true,id]);
    return id;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};

module.exports.updateUser = async function (id,user,subjects,role){

  const client = await pool.connect();
  const f_query = "UPDATE users SET phone_number = $1 WHERE id = $2 RETURNING id";

  try{
    const f = await client.query(f_query,[user.phoneNumber,id]);
  
    return f.rows[0].id;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};


module.exports.findCloseMentor = async function(lat, lng, subject){
  const client = await pool.connect();
  let query;
  let results;
  if(subject){
    query = `SELECT name, email , phone_number , about ,is_verified ,users.id,subjects,city_name,imageurl
     FROM mentors INNER JOIN users ON users.id = mentors.user_id
    WHERE ST_DWithin(mentors.location, ST_SetSRID(ST_MakePoint($1, $2),4326),10000)
    AND $3= ANY(mentors.subjects);`
    try{
      results = await client.query(query,[lng,lat,subject]);
      return results.rows;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  }else {
    query = `SELECT name, email , phone_number , about ,is_verified ,users.id,subjects,city_name,imageurl
     FROM mentors INNER JOIN users on users.id = mentors.user_id
    WHERE ST_DWithin(mentors.location, ST_SetSRID(ST_MakePoint($1, $2),4326),10000);`;
    try{
      results = await client.query(query,[lng,lat]);
      return results.rows;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  }
};
module.exports.getMentorById = async function(id){
  const client = await pool.connect();
  const query = `SELECT name, email , phone_number , about ,is_verified ,users.id,subjects,city_name,
  imageurl,lat,lng
  FROM mentors INNER JOIN users ON users.id = mentors.user_id WHERE mentors.user_id=$1`;
  try {
    const result = await client.query(query,[id]);
    return result.rows[0];
  }finally{
    client.release();
  }
};
module.exports.addJob = async function (mentor, student){
  const client = await pool.connect();
  const query =`INSERT INTO jobs(mentor_id,student_id,mentor_name,student_name,mentor_phone_number) 
  VALUES($1,$2,$3,$4,$5)`;

  try {
    const res = await client.query(query,
      [ mentor.id,
        student.id,
        mentor.name,
        student.name,
        mentor.phoneNumber
      ]);
      return [mentor,student] ;

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
  const query = `SELECT * FROM jobs WHERE ${id}=$1`;
  try{
    console.log(id);
    console.log(user.id);
    const results = await client.query(query,[user.id]);
    return results.rows;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};
module.exports.updateImageUrl = async function (id,url){
  const client = await pool.connect();
  const query = 'UPDATE mentors SET imageurl = $1 WHERE user_id = $2 RETURNING imageurl';
  try {
    const update = await client.query(query,[url,id]);
    return update.rows[0];
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};



module.exports.updatePassword = async function(email,password){
  const client  = await pool.connect();
  const query = 'UPDATE users SET password_reset_token = NULL ,password =$1 WHERE email = $2';
  try{
    const update = await client.query(query,[password,email]);
    return update;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};
module.exports.getUserByRole = async function(email,role){
  const client  = await pool.connect();
  const query = 'SELECT * FROM users WHERE role=$1 AND email=$2';
  try{
    const result = await client.query(query,[role,email]);
    return result.rows[0];
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
};

module.exports.getSubjects = async function(){
  const client = await pool.connect();
  const query = 'SELECT * FROM subjects'
  try{
    const result = await client.query(query);
    return result.rows;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
}