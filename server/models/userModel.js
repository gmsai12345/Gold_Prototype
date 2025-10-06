import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
const db = require('./db');

const User = {
  async create({ username, email, password, role = 'user', status = 'pending' }) {
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
      [username, email, password, role, status]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  },

  async updateStatus(id, status) {
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }
};

module.exports = User;

// Update the timestamp before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;