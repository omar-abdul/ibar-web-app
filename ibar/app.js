var express = require("express")  
var path = require("path")  

var logger = require("morgan")  
var cookieParser = require("cookie-parser")  
var bodyParser = require("body-parser")  
var cors = require("cors")  
var helmet = require("helmet")  

const {
	DatabaseError,
	SendMailError,
	UploadError
} = require("./helper/custom-errors")  

var passport = require("passport")  
const winston = require("winston")  
const pool = require("./config/config")  

var index = require("./routes/index")  

require("dotenv").config()  

var app = express()  

winston.level = process.env.LOG_LEVEL  

app.use(logger("short"))  
app.use(helmet())  
app.use(cors({credentials:true,origin:"http://localhost:4200"}))  
app.use(bodyParser.json())  
app.use(passport.initialize())  
app.use(passport.session())  

require("./config/passport")(passport)  
app.use(bodyParser.urlencoded({ extended: false }))  
app.use(cookieParser())  
app.use(express.static(path.join(__dirname, "public")))  

var server = app.listen(process.env.PORT || 4000, function() {
	console.log("Server started at : " + process.env.PORT)  
})  

var graceFullShutdown = function() {
	console.log("Signal recieved")  
	server.close(function() {
		console.log("closed out all connections")  
		process.exit()  
	})  

	setTimeout(function() {
		console.error("could not close connections in time")  
		process.exit()  
	}, 10 * 1000)  
}  

process.on("SIGTERM", graceFullShutdown)  

process.on("SIGINT", graceFullShutdown)  
process.on("unhandledRejection", (reason, p) => {
	console.log("Unhandled Rejection at: Promise", p, "reason:", reason)  
	// application specific logging, throwing an error, or other logic here

	throw new Error("Unhandled promise at :" + p + "\n reason: " + reason)  
})  

pool.on("error", (err, client) => {
	console.error("Unexpected error on idle client", err)  
	process.exit(-1)  
})  

// app.use("/api", index)
app.use("/api", require("./components/token/router"))  
app.use("/api", require("./components/mentor/router"))  
app.use("/api", require("./components/comment/router"))  
app.use("/api", require("./components/user/router"))  
app.use("/api", require("./components/job/router"))  

app.get("/", (req, res) => {
	res.send("Invalid end Point")  
})  
// app.get("*", (req, res)=>{
// 	if(req.headers.referer!=="http://ibar.so"){
// 		res.status(401).json({
// 			msg:"You are not authorized to access this site"

// 		})
// 	}
// })

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "public/index.html"))  
})  

app.use(function handleDbError(error, req, res, next) {
	if (error instanceof DatabaseError) {
		winston.log("debug", error.message)  
		res.json({
			success: false,
			msg: "Oops looks like something went wrong! Our bad :("
		})  
	} else {
		next(error)  
	}
})  
app.use(function handleMailError(error, req, res, next) {
	if (error instanceof SendMailError) {
		winston.log("debug", error.message)  
		res.json({
			success: false,
			msg: [
				{
					msg:
						"There was an error sending the confirmation email, try resending"
				}
			]
		})  
	} else {
		next(error)  
	}
})  
app.use(function handleUploadError(error, req, res, next) {
	if (error instanceof UploadError) {
		winston.log("debug", error.message)  
		res.json({
			success: false,
			msg: "There was an error uploading the image, try again in a little bit"
		})  
	} else {
		next(error)  
	}
})  
app.use(function(error, req, res, next) {
	winston.log("debug", error.message)  
	res.json({
		success: false,
		msg: "Oops looks like something went wrong, try again"
	})  
})  

module.exports = app  
