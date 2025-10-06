const db = require('./db');

const Gold = {
  async create({ user_id, gold_weight, gold_type, value }) {
    const [result] = await db.query(
      'INSERT INTO gold_inventory (user_id, gold_weight, gold_type, value) VALUES (?, ?, ?, ?)',
      [user_id, gold_weight, gold_type, value]
    );
    return result.insertId;
  },

  async findByUserId(user_id) {
    const [rows] = await db.query('SELECT * FROM gold_inventory WHERE user_id = ?', [user_id]);
    return rows;
  },

  async getAll() {
    const [rows] = await db.query('SELECT * FROM gold_inventory');
    return rows;
  }
};

module.exports = Gold;
