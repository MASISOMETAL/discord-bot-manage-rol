const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/roles.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS roles (
    server_id TEXT,
    role_id TEXT,
    password TEXT UNIQUE
  )`);
});

module.exports = {
  addRole(serverId, roleId, password) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO roles (server_id, role_id, password) VALUES (?, ?, ?)`;
      db.run(query, [serverId, roleId, password], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getRoleByPassword(serverId, password) {
    return new Promise((resolve, reject) => {
      const query = `SELECT role_id FROM roles WHERE server_id = ? AND password = ?`;
      db.get(query, [serverId, password], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getAllRoles(serverId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT role_id, password FROM roles WHERE server_id = ?`;
      db.all(query, [serverId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  deleteRoleByPassword(serverId, password) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM roles WHERE server_id = ? AND password = ?`;
      db.run(query, [serverId, password], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
};
