const jwt = require("jsonwebtoken")

module.exports.signToken = function(data, expiry ="10m") {
	
	return jwt.sign(
		{
			data:data
		},
		process.env.DB_SECRET,
		{
			expiresIn:expiry
		}
	)

}
