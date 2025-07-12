// models/user.js
const db = require("../db");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

async function createUser(username, password) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const result = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
    [username, hashed]
  );
  return result.rows[0];
}

async function findUserByUsername(username) {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
}

async function validatePassword(inputPassword, storedHash) {
  return await bcrypt.compare(inputPassword, storedHash);
}

module.exports = {
  createUser,
  findUserByUsername,
  validatePassword,
};
