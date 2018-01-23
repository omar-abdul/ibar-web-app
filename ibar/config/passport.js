const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const passport = require('passport');

const config =require('../config/database');
const User = require('../controller/util')



module.exports=function(passport){
	let opts={}

	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
	opts.secretOrKey = process.env.DB_SECRET;

	passport.use(new JwtStrategy(opts, function(jwt_payload,done){
		// console.log(jwt_payload);
		
				User.getUserById(jwt_payload.data.id).then((results)=>{
					// if(err) return done(err,false);

					if(results){
						return done(null, results);
					}else{
						return done(null, false);
					}

				});
	}));
}