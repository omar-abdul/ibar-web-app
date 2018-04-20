const crypto = require("crypto")


module.exports.createCrytoHmac = function (email){
	const refreshToken = crypto
		.createHmac("sha256", process.env.CRYPTO_SECRET)
		.update(email)
		.digest("hex")

	return refreshToken
}