const pg = require("pg");
var config = require("../config/database");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto')

require("dotenv").config();

const pool = pg.Pool(config);

function genSalt() {
  return new Promise(resolve => {
    bcrypt.genSalt(10, (err, salt) => resolve(salt));
  });
}

async function hashPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hashed= await bcrypt.hash(password,salt);
  return  hashed;

}

module.exports.addUser = async function(user) {




  let password = await hashPassword(user.password);
 

  pool.connect(function(err, client, done) {
    const query =
      `with rows as(INSERT INTO users(name,password,email,phone_number,role,is_verified) values ($1,$2,$3,$4) RETURNING id)
     INSERT  INTO mentors(name,phone_number userid)SELECT id, name, phone_number FROM rows ;`;
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      query,
      [
        user.name,
        password,
        user.email,
        user.phoneNumber,
        user.role,
        false
      ],
      function(err, result) {
        done();

        if (err) {
          return console.error("error happened during query", err);
        }

        console.log(result);
        // process.exit(0)
        return result.rows[0];
      }
    );



  });
};

module.exports.getUserById = function(id) {


  const query = `SELECT * FROM users WHERE id = $1 `;
 return new Promise((resolve)=>{
  pool.connect(function(err, client, done) {
    if (err) {
      return console.error("error fetching", err);
    }
    client.query(query, [id], (err,results)=>{
      done();
      if (err) {
        return console.error("error happened during query", err);
      }

      
      resolve(results.rows[0]);
    });
  });

 }) 
};

module.exports.authenticateUser = async function(email, password) {
  const query =
    "SELECT * FROM users WHERE (email = $1) AND is_verified =$2";
  return new Promise((resolve, reject) => {
    pool.connect(async function(err, client, done) {
      if (err) {
        return console.error("error fetching", err);
      }
     let results = await client.query(query, [email,true])
     if(results.rows.length>0){
       const user = results.rows[0];
       console.log(user)
       let isMatch =await  bcrypt.compare(password,user.password)
       if(isMatch){
         const token = jwt.sign({data:user},process.env.DB_SECRET,{expiresIn:6040800})
         const   res={
           success:true,
           token:"JWT "+token,
           user:user

         }
         resolve(res)
       }
       else if(!isMatch){
         const res = {
           success:false,
           msg:"Email or password are incorrect"
         }
         resolve(res)
       }
     }
     else {
       const res = {
         success:false,
         msg:"Email or password are incorrect"
       }
       resolve(res)
     }
    });
  });
};
