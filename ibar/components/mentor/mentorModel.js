const {Pool} = require("pg");
var config = require("../../config/config");
var bcrypt = require("bcryptjs");
const crypto = require('crypto');
const {DatabaseError} = require("../../helper/custom-errors");

require("dotenv").config();

const pool = config;
module.exports.addMentor = async function(user){
  const client = await pool.connect();
  const query = `INSERT INTO mentors (user_id,location,lat,lng,city_name) VALUES($1,ST_SetSRID(ST_MakePoint($2,$3),4326),
  $3,$2,$4)`

  try{
    const result = await client.query(query,[
      user.id,
      user.location.lng,
      user.location.lat,
      user.city_name

    ]);
    return result.rowCount;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }

}

module.exports.addTeachSubject = async function (user){
  const client = await pool.connect();
  const query = `INSERT INTO teach_subject (mentor_id,subject_id) 
  VALUES($1,$2)`


  try{
    const result = await client.query(query,[
      user.id,
      user.subject_id
    ]);
    return result.rowCount;
  }catch(e){
    throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);

  }finally {
    client.release();

  }
}
module.exports.getMentorById = async function(id){
    const client = await pool.connect();
    const query = `SELECT * FROM getMentorById($1); `
    ;
    try {
      const result = await client.query(query,[id]);
      return result.rows[0];
    }finally{
      client.release();
    }
  };

  module.exports.findCloseMentor = async function(lat, lng, subject){
    const client = await pool.connect();
    let query;
    let results;
    if(subject){
      query = `SELECT * FROM getNearbyMentorsWithSubject($1,$2,$3)`
      try{
        results = await client.query(query,[lng,lat,subject]);
        return results.rows;
      }catch(e){
        throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
    
      }finally {
        client.release();
    
      }
    }else {
      query = `SELECT * FROM getNearbyMentors($1,$2)`;
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

  module.exports.updateMentor = async function(id,user,subjects){
    const client = await pool.connect();
    const s_query = `SELECT updateMentor($1,$2,$3,$4,$5,$6,$7)`
    try{
  
        const s = await client.query(s_query,
          [
            id,
            user.location.longtitude,
            user.location.latitude,
            user.city_name,
            subjects,
            user.about,
            user.imageurl,
            
          ]);
          
       
        
      return id;
    }catch(e){
      throw new DatabaseError("There was an error connecting or querying the database : "+ e.message);
  
    }finally {
      client.release();
  
    }
  };