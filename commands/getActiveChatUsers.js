module.exports = {
    regexp: /^(\/|!)актив/i,
    callback: (msg) => {
        let count = parseInt(msg.text.replace(/(\/|!)актив/, '')) || 15
        if (!(parseInt(count) >= 1 || parseInt(count) > 20)) {
            msg.send('Неверное число после <<!актив>>.');
            return;
        }
        count = parseInt(count)
        if (count > 30) {
            msg.send('Не более 30.');
            return;
        }
        if (count < 2) {
            msg.send('Не менее 2.');
            return;
        }
        const peer = msg.peer_id;
        let id = msg.from_id;
        const api = msg.callMethod;
        const connection = msg.mysql;

        if ((peer - 2e9) < 0 || !(parseInt(id) > 0)) return;

        connection.query('SELECT * FROM active WHERE chat = ? ORDER BY count DESC LIMIT ' + count, [peer],
            (e, r) => {
                if (!r[count - 1]) {
                    msg.send(`В данном чате менее ${count} активных пользователей.`);
                    return
                }
                let rsp = ' ';

                let users = [];
                let dataCount = [];

                r.forEach((e, i) => {
                    if (e.user > 0) {
                        users.push(e.user);
                        dataCount.push(e.count);
                    }
                })

                console.log(users)

                api('users.get', {
                    user_ids: users.toString()
                }).then(usrs => {
                    usrs.forEach((e, i) => {
                        rsp = rsp + `${i + 1}. @id${e.id}(${e.first_name} ${e.last_name}) -- (${dataCount[i]} сообщения) \n`
                    })
                    api('messages.send', {
                        disable_mentions: 1,
                        peer_id: peer,
                        message: rsp,
                        random_id: 0
                    })
                })

            })
    },
};
