module.exports = {
  regexp: /^\/админ$/,
  callback: async (msg, text) => {
    const peer = msg.peer_id;
    const user = msg.from_id;
    let id;
    const api = msg.callMethod;
    const connection = msg.mysql;
    const conn = msg.asyncMysql;

    if (peer - 2e9 < 0) return;


    if (msg.fwd_messages[0]) {
      id = msg.fwd_messages[0].from_id;
    } else if (msg.reply_message) {
      id = msg.reply_message.from_id;
    }

    if (parseInt(id) < 0) return;

    const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, user]);
    const [secondUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);

    if (curUser[0] && curUser[0].owner) {
      if (secondUser[0]) {
        api('users.get', {
          user_ids: id,
        })
          .then(rr => {
            msg.send(`@id${id}(${rr[0].first_name}) теперь не администратор.`);
          });
        connection.query('DELETE FROM admins WHERE user = ?', [id]);
      } else {
        api('users.get', {
          user_ids: id,
          fields: 'sex',
        })
          .then(rr => {
            msg.send(`@id${id}(${rr[0].first_name}) ${rr[0].sex === 1 ? 'назначена' : 'назначен'} администратором беседы.`);
          });
        connection.query('INSERT INTO admins (chat, user) VALUES (?,?)', [peer, id]);
      }
    }
  },
};
