const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt


const User = require("../components/user/userModel")

module.exports = function(passport) {
	let opts = {}

	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt")
	opts.secretOrKey = process.env.DB_SECRET

	passport.use(
		new JwtStrategy(opts, function(jwt_payload, done) {

			User.getUserById(jwt_payload.data.id)
				.then(results => {
					

					if (results) {
						return done(null, results)
					} else {
						return done(null, false)
					}
				})
				.catch(error => Error(error))
		})
	)
}
