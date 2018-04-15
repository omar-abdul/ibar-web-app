var express = require("express");
var router = express.Router();

const Controller = require("./commentController");




router.get("/comments/:id",Controller.getCommentHandler);
router.post("/add-comment",Controller.addCommentHandler);


module.exports = router