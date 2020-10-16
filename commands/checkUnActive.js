module.exports = {
  regexp: /^(\/|!)чекнеактив/i,
  callback: (msg) => {
    let count = parseInt(msg.text.replace(/(\/|!)чекнеактив/, '')) || 15;
    if (!(parseInt(count) >= 1 || parseInt(count) > 20)) {
      msg.send('Неверное число после <<!чекнеактив>>.');
      return;
    }
    count = parseInt(count);
    if (count > 5000) {
      msg.send('Не более 5000.');
      return;
    }

    const peer = msg.peer_id;
    let id = msg.from_id;
    const api = msg.callMethod;
    const connection = msg.mysql;

    if ((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

    connection.query('SELECT * FROM active WHERE chat = ? AND count < ?', [peer, count + 1],
      (e, r) => {
        if (!r[0]) {
          msg.send(`
          В данном чате нет пользователей, который написали менее ${count} сообщений.
          `);
        } else {
          msg.send(`
          Пользователей, написавших менее ${count} сообщений -- ${r.length}
          
           Чтобы исключить их, администратор чата должен написать <<!кикнеактив ${count}>>.
          `);
        }
      });
  },
};
