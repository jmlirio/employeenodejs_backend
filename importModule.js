const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { jsonwebtoken,  authenticateToken} = require("./middleware/protection/authorization");
const { db } = require("./databaseConnector/connection");

module.exports = {
  express,
  router,
  bcrypt,
  jsonwebtoken,
  db,
  authenticateToken
};