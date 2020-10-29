module.exports = {
  regexp: /^(\/|!)кикнеактив/i,
  callback: async (msg) => {

    let count = parseInt(msg.text.replace(/(\/|!)кикнеактив/, '')) || 15;
    if (!(parseInt(count) >= 1 || parseInt(count) > 20)) {
      msg.send('Неверное число после <<!кикнеактив>>.');
      return;
    }
    count = parseInt(count);
    if (count > 20) {
      msg.send('Не более 20.');
      return;
    }

    const peer = msg.peer_id;
    let id = msg.from_id;
    const api = msg.callMethod;
    const conn = msg.asyncMysql;
    const connection = msg.mysql;
    if ((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

    const [curUser] = await conn.query('SELECT * FROM admins WHERE chat = ? AND user = ?', [peer, id]);
    const [maxID] = await conn.query('SELECT MAX(id) FROM active');

    console.log(maxID[0]['MAX(id)']);

    if (curUser[0]) {
      api('messages.getConversationMembers', {
        peer_id: peer,
      })
          .then(res => {
            if (res) {
              connection.query('SELECT * FROM active WHERE chat = ? AND count < ? AND id < ?', [peer, count + 1, maxID[0]['MAX(id)'] - 100],
                  (e, r) => {
                      if (!r || !r[0]) {
                      msg.send(`В данном чате нет пользователей, который написали менее ${count} сообщений.`);
                    } else {
                      let unActive = [];
                      let kicking = [];

                      r.forEach(el => unActive.push(el.user));
                      res.items.forEach(el => {
                        if (unActive.includes(el.member_id)) {
                          kicking.push(el.member_id);
                        }
                      });
                      msg.send(`
                Пользователей, написавших менее ${count} сообщений -- ${kicking.length}.
                 `);
                      kicking.forEach((user, key) => {
                        setTimeout(() => {
                          api('messages.removeChatUser', {
                            chat_id: peer - 2e9,
                            member_id: user,
                            v: '5.103',
                          });
                        }, key + 500)
                      });
                    }
                  });
            } else {
              msg.send('Кажется, у меня нет прав администратора, я не смогу работать без них ;(');
            }
          });
    }
  },
};
