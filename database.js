const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/roles.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS roles (
    server_id TEXT,
    role_id TEXT,
    password TEXT UNIQUE
  )`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS group_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT NOT NULL,
    master_role_id TEXT NOT NULL UNIQUE,
    assignable_role_id TEXT NOT NULL
  )`);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS passwords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server_id TEXT NOT NULL,
    master_role_id TEXT NOT NULL,
    password TEXT UNIQUE NOT NULL,
    FOREIGN KEY (master_role_id) REFERENCES group_roles(master_role_id)
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
  },

  // funcionabilidad extra

  addGroupRole(serverId, masterRoleId, assignableRoleId) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO group_roles (server_id, master_role_id, assignable_role_id) VALUES (?, ?, ?)`;
      db.run(query, [serverId, masterRoleId, assignableRoleId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getGroupRole(serverId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT master_role_id, assignable_role_id FROM group_roles WHERE server_id = ?`;
      db.all(query, [serverId], (err, row) => {
        if (err) reject(err)
        else resolve(row)
      })
    })
  },

  createPassword(serverId, masterRoleId, password) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO passwords (server_id, master_role_id, password) VALUES (?, ?, ?)`;
      db.run(query, [serverId, masterRoleId, password], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getRoleByPasswordGroup(serverId, password) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT assignable_role_id, group_roles.master_role_id
        FROM group_roles 
        JOIN passwords ON group_roles.master_role_id = passwords.master_role_id 
        WHERE passwords.server_id = ? AND passwords.password = ?`;
      db.get(query, [serverId, password], (err, row) => {
        if (err || !row) reject(err || 'No existe un rol asignable para este password.');
        else resolve(row);
      });
    });
  },

  getMasterRolePasswords(serverId, masterRoleId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT password FROM passwords WHERE server_id = ? AND master_role_id = ?`;
      db.all(query, [serverId, masterRoleId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  deletePassword(serverId, masterRoleId, password) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM passwords WHERE server_id = ? AND master_role_id = ? AND password = ?`;
      db.run(query, [serverId, masterRoleId, password], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getMasterRole(serverId, masterRoleId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM group_roles WHERE server_id = ? AND master_role_id = ?`;
      db.get(query, [serverId, masterRoleId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  deleteGroupRole(serverId, masterRoleId) {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM group_roles WHERE server_id = ? AND master_role_id = ?`;
      db.run(query, [serverId, masterRoleId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getGroupRoleByMasterRole(serverId, masterRoleId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT assignable_role_id 
        FROM group_roles 
        WHERE server_id = ? AND master_role_id = ?`;
      db.get(query, [serverId, masterRoleId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

};
