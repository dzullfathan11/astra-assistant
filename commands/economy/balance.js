const Database = require('better-sqlite3');
const db = new Database('./database/economy.db');

module.exports = {
  name: 'balance',

  execute(message) {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS economy (
        userId TEXT,
        money INTEGER
      )`
    ).run();

    let user = db
      .prepare('SELECT * FROM economy WHERE userId = ?')
      .get(message.author.id);

    if (!user) {
      db.prepare(
        'INSERT INTO economy (userId, money) VALUES (?, ?)'
      ).run(message.author.id, 0);

      user = { money: 0 };
    }

    message.reply(`Balance kamu: ${user.money}`);
  }
};