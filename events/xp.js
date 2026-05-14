const Database = require('better-sqlite3');
const db = new Database('./database/levels.db');

module.exports = client => {
  client.on('messageCreate', message => {
    if (message.author.bot) return;

    db.prepare(
      `CREATE TABLE IF NOT EXISTS levels (
        userId TEXT,
        xp INTEGER,
        level INTEGER
      )`
    ).run();

    let data = db
      .prepare('SELECT * FROM levels WHERE userId = ?')
      .get(message.author.id);

    if (!data) {
      db.prepare(
        'INSERT INTO levels VALUES (?, ?, ?)'
      ).run(message.author.id, 0, 1);

      data = {
        xp: 0,
        level: 1
      };
    }

    let xp = data.xp + 10;
    let level = data.level;

    if (xp >= level * 100) {
      level++;
      xp = 0;

      message.channel.send(
        `${message.author} naik ke level ${level}`
      );
    }

    db.prepare(
      'UPDATE levels SET xp = ?, level = ? WHERE userId = ?'
    ).run(xp, level, message.author.id);
  });
};