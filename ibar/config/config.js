const config = require("./database");

const {Pool} = require("pg");
const pool = new Pool(config);

module.exports = pool;